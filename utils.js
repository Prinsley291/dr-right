// Dr. Right — utilitaires partagés
// Chargé sur toutes les pages après supabase-client.js.

// ------------------------------------------------------
// SECURISER UNE VALEUR AVANT INSERTION DANS innerHTML
// ------------------------------------------------------
// Toute donnée venant de la base ou d'un formulaire DOIT
// passer par cette fonction avant d'être interpolée dans
// un template HTML. Sinon un nom, une note ou un moyen de
// paiement contenant <script> ou onerror= s'exécute chez
// tous les utilisateurs qui consultent la page.

function echapperHTML(valeur) {

    return String(valeur ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ------------------------------------------------------
// FORMATER UN MONTANT EN FCFA
// ------------------------------------------------------

function formaterMontant(valeur) {

    const nombre = Number(valeur);

    if (!Number.isFinite(nombre)) {
        return "0";
    }

    return nombre.toLocaleString("fr-FR");

}


// ------------------------------------------------------
// VALIDER UN MONTANT SAISI
// ------------------------------------------------------
// Le FCFA n'a pas de centimes : on exige un entier positif
// et on refuse les valeurs aberrantes (ex. "1e12").

const MONTANT_MAXIMUM = 100000000;

function montantEstValide(valeur) {

    const nombre = Number(valeur);

    return (
        Number.isInteger(nombre) &&
        nombre > 0 &&
        nombre <= MONTANT_MAXIMUM
    );

}


// ------------------------------------------------------
// VALIDER UNE QUANTITE SAISIE
// ------------------------------------------------------

const QUANTITE_MAXIMUM = 1000;

function quantiteEstValide(valeur) {

    const nombre = Number(valeur);

    return (
        Number.isInteger(nombre) &&
        nombre > 0 &&
        nombre <= QUANTITE_MAXIMUM
    );

}


// ------------------------------------------------------
// VERROUILLER UN FORMULAIRE PENDANT UNE ACTION
// ------------------------------------------------------
// Empêche la double soumission (double clic, touche Entrée
// répétée) qui créerait deux paiements ou deux dettes.
//
// Usage :
//   const deverrouiller = verrouillerFormulaire(formulaire);
//   if (!deverrouiller) return; // déjà en cours
//   try { ... } finally { deverrouiller(); }

function verrouillerFormulaire(formulaire) {

    if (!formulaire || formulaire.dataset.enCours === "1") {
        return null;
    }

    formulaire.dataset.enCours = "1";

    const boutons = Array.from(
        formulaire.querySelectorAll("button")
    );

    boutons.forEach(function (bouton) {
        bouton.disabled = true;
    });

    return function deverrouiller() {

        delete formulaire.dataset.enCours;

        boutons.forEach(function (bouton) {
            bouton.disabled = false;
        });

    };

}


// ------------------------------------------------------
// FORMATER UNE DATE
// ------------------------------------------------------

function formaterDateHeure(valeur) {

    if (!valeur) {
        return "-";
    }

    const date = new Date(valeur);

    if (Number.isNaN(date.getTime())) {
        return "Date invalide";
    }

    return date.toLocaleString("fr-FR");

}
