import { useState } from "react";
import { RotateCw } from "lucide-react";
import front from "@/assets/card-front.png";
import profileCapture from "@/assets/demo-profile-capture.jpg";
import back from "@/assets/card-back.png";

/** Real product photography, CSS depth only; no WebGL or continuous animation. */
export function HeroProductVisual() {
  const [flipped, setFlipped] = useState(false);
  return (
    <figure className="iw-product">
      <div className="iw-hero-phone">
        <div className="iw-profile-frame">
          <img
            src={profileCapture}
            alt="Capture du vrai profil Signature : Camille Exemple, personne fictive et avatar illustré"
            width={327}
            height={747}
          />
        </div>
        <p>VRAIE INTERFACE · PROFIL FICTIF</p>
      </div>
      <div className="iw-card-stage" data-flipped={flipped}>
        <div className="iw-card-plane">
          <img
            src={flipped ? back : front}
            alt={
              flipped
                ? "Verso de la carte i-wasp noire, avec une marquage doré"
                : "Recto de la carte i-wasp noire, avec son logo doré"
            }
            width={1024}
            height={576}
            fetchPriority="high"
          />
        </div>
      </div>
      <figcaption>
        <div>
          <span className="iw-product-label">LA CARTE i-WASP</span>
          <p role="status">{flipped ? "Verso" : "Recto"} · visuel du produit</p>
        </div>
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          aria-label={
            flipped ? "Voir le recto de la carte" : "Voir le verso de la carte"
          }
          aria-pressed={flipped}
        >
          <RotateCw size={16} aria-hidden="true" /> Changer de vue
        </button>
      </figcaption>
    </figure>
  );
}
export default HeroProductVisual;
