-- Ferme une fuite de données commerciales.
--
-- `get_daily_analytics` et `get_express_checkout_funnel` sont des fonctions
-- SECURITY DEFINER exposées via /rest/v1/rpc/... et exécutables par le rôle
-- `anon` : n'importe qui, sans compte, pouvait lire le nombre de vues, le
-- tunnel de conversion et le CHIFFRE D'AFFAIRES quotidien.
--
-- Elles ne sont appelées que par le tableau de bord admin
-- (src/pages/admin/ConversionDashboard.tsx). On leur ajoute donc la même garde
-- interne que les autres fonctions admin du projet (cf. admin_set_card_lifecycle)
-- et on retire le droit d'exécution à `anon`.
--
-- Les corps de fonction sont repris À L'IDENTIQUE : seule la garde est ajoutée.

CREATE OR REPLACE FUNCTION public.get_daily_analytics(p_days integer DEFAULT 7)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_result JSONB;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Admin required' USING ERRCODE = '42501';
  END IF;

  SELECT jsonb_agg(daily_stats ORDER BY day DESC)
  INTO v_result
  FROM (
    SELECT
      DATE(created_at) as day,
      COUNT(*) FILTER (WHERE event_name = 'express_offre_view') as page_views,
      COUNT(*) FILTER (WHERE event_name = 'express_purchase') as purchases,
      COUNT(*) FILTER (WHERE event_name = 'webstudio_cta_click') as webstudio_clicks,
      COALESCE(SUM(event_value) FILTER (WHERE event_name = 'express_purchase'), 0) as revenue
    FROM public.analytics_events
    WHERE created_at > NOW() - (p_days || ' days')::INTERVAL
    GROUP BY DATE(created_at)
  ) daily_stats;

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_express_checkout_funnel(p_days integer DEFAULT 30)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_result JSONB;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Admin required' USING ERRCODE = '42501';
  END IF;

  SELECT jsonb_build_object(
    'page_views', COUNT(*) FILTER (WHERE event_name = 'express_offre_view'),
    'offer_selections', COUNT(*) FILTER (WHERE event_name = 'express_offer_select'),
    'info_submissions', COUNT(*) FILTER (WHERE event_name = 'express_infos_submit'),
    'payment_initiations', COUNT(*) FILTER (WHERE event_name = 'express_payer_view'),
    'purchases', COUNT(*) FILTER (WHERE event_name = 'express_purchase'),
    'webstudio_clicks', COUNT(*) FILTER (WHERE event_name = 'webstudio_cta_click'),
    'webstudio_offer_views', COUNT(*) FILTER (WHERE event_name = 'webstudio_offre_view')
  )
  INTO v_result
  FROM public.analytics_events
  WHERE created_at > NOW() - (p_days || ' days')::INTERVAL;

  RETURN v_result;
END;
$function$;

-- Défense en profondeur : plus aucun appel possible sans être authentifié.
REVOKE EXECUTE ON FUNCTION public.get_daily_analytics(integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_express_checkout_funnel(integer) FROM anon, public;
GRANT  EXECUTE ON FUNCTION public.get_daily_analytics(integer) TO authenticated;
GRANT  EXECUTE ON FUNCTION public.get_express_checkout_funnel(integer) TO authenticated;
