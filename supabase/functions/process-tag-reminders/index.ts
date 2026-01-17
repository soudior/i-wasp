import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function logStep(step: string, details?: Record<string, unknown>) {
  console.log(`[PROCESS-TAG-REMINDERS] ${step}`, details ? JSON.stringify(details) : '');
}

interface TagReminderRule {
  id: string;
  tag_id: string;
  days_after_assignment: number;
  reminder_title: string;
  reminder_description: string | null;
  priority: string;
  is_active: boolean;
}

interface TagAssignment {
  id: string;
  client_id: string;
  client_type: string;
  tag_id: string;
  created_at: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    logStep("Starting tag reminder processing");

    // Fetch active reminder rules
    const { data: rules, error: rulesError } = await supabase
      .from('tag_reminder_rules')
      .select('*')
      .eq('is_active', true);

    if (rulesError) {
      throw new Error(`Failed to fetch rules: ${rulesError.message}`);
    }

    logStep("Fetched active rules", { count: rules?.length || 0 });

    if (!rules || rules.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active rules to process", created: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch all tag assignments
    const { data: assignments, error: assignmentsError } = await supabase
      .from('client_tag_assignments')
      .select('*');

    if (assignmentsError) {
      throw new Error(`Failed to fetch assignments: ${assignmentsError.message}`);
    }

    logStep("Fetched tag assignments", { count: assignments?.length || 0 });

    // Fetch existing reminders to avoid duplicates
    const { data: existingReminders, error: remindersError } = await supabase
      .from('client_reminders')
      .select('client_id, tag_id, status')
      .in('status', ['pending', 'overdue']);

    if (remindersError) {
      throw new Error(`Failed to fetch existing reminders: ${remindersError.message}`);
    }

    // Create a set of existing reminder keys for quick lookup
    const existingKeys = new Set(
      existingReminders?.map(r => `${r.client_id}-${r.tag_id}`) || []
    );

    let createdCount = 0;
    const now = new Date();

    // Process each rule
    for (const rule of rules as TagReminderRule[]) {
      // Find assignments for this tag
      const tagAssignments = (assignments as TagAssignment[])?.filter(
        a => a.tag_id === rule.tag_id
      ) || [];

      for (const assignment of tagAssignments) {
        const assignmentDate = new Date(assignment.created_at);
        const triggerDate = new Date(assignmentDate);
        triggerDate.setDate(triggerDate.getDate() + rule.days_after_assignment);

        // Check if it's time to create the reminder
        if (triggerDate <= now) {
          const reminderKey = `${assignment.client_id}-${rule.tag_id}`;
          
          // Skip if reminder already exists
          if (existingKeys.has(reminderKey)) {
            continue;
          }

          // Create the reminder
          const { error: insertError } = await supabase
            .from('client_reminders')
            .insert({
              client_id: assignment.client_id,
              client_type: assignment.client_type,
              tag_id: rule.tag_id,
              reminder_type: 'auto_tag',
              title: rule.reminder_title,
              description: rule.reminder_description,
              due_date: now.toISOString(),
              status: 'pending',
              priority: rule.priority,
            });

          if (insertError) {
            logStep("Failed to create reminder", { 
              client_id: assignment.client_id, 
              error: insertError.message 
            });
          } else {
            createdCount++;
            existingKeys.add(reminderKey); // Prevent duplicates in same run
            logStep("Created reminder", { 
              client_id: assignment.client_id,
              tag_id: rule.tag_id,
              title: rule.reminder_title
            });
          }
        }
      }
    }

    // Update overdue reminders
    const { error: updateError } = await supabase
      .from('client_reminders')
      .update({ status: 'overdue' })
      .eq('status', 'pending')
      .lt('due_date', now.toISOString());

    if (updateError) {
      logStep("Failed to update overdue reminders", { error: updateError.message });
    }

    logStep("Processing complete", { created: createdCount });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Created ${createdCount} new reminders`,
        created: createdCount,
        rulesProcessed: rules.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logStep("Error processing reminders", { error: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
