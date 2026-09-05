// Dr. Right — vérification centralisée de l'accès administrateur
// Chargé sur toutes les pages réservées aux administrateurs,
// après supabase-client.js.
//
// Rappel : cette vérification côté client ne fait que guider
// l'interface. La vraie protection des données est assurée
// par les policies RLS et les fonctions RPC de Supabase
// (voir supabase/securite.sql).

const PAGE_CONNEXION_ADMIN = "./connexion-administrateur.html";


// ------------------------------------------------------
// REDIRIGER VERS LA CONNEXION
// ------------------------------------------------------
// replace() évite que la page protégée reste dans
// l'historique et soit rechargée avec le bouton Retour.

function redirigerVersConnexionAdmin() {

    window.location.replace(PAGE_CONNEXION_ADMIN);

}


// ------------------------------------------------------
// VERIFIER L'ADMINISTRATEUR CONNECTE
// ------------------------------------------------------
// Retourne l'administrateur ({ id, prenom, nom }) ou null
// après avoir redirigé vers la page de connexion.
//
// options.elementMessage : élément où afficher l'état
// ("Vérification..." puis "Connecté : Prénom Nom").

async function verifierAdministrateur(options) {

    const elementMessage =
        options && options.elementMessage
            ? options.elementMessage
            : null;


    if (elementMessage) {
        elementMessage.textContent =
            "Vérification de votre accès...";
    }


    const {
        data: sessionData,
        error: sessionError
    } = await supabaseClient.auth.getSession();


    if (
        sessionError ||
        !sessionData ||
        !sessionData.session
    ) {

        redirigerVersConnexionAdmin();

        return null;
    }


    const session = sessionData.session;


    const {
        data: administrateur,
        error: erreurAdministrateur
    } = await supabaseClient
        .from("administrateurs")
        .select("id, prenom, nom")
        .eq("auth_user_id", session.user.id)
        .eq("statut", "actif")
        .maybeSingle();


    if (
        erreurAdministrateur ||
        !administrateur
    ) {

        await supabaseClient.auth.signOut();

        redirigerVersConnexionAdmin();

        return null;
    }


    if (elementMessage) {

        const nomComplet =
            `${administrateur.prenom || ""} ${administrateur.nom || ""}`.trim();

        elementMessage.textContent =
            nomComplet
                ? `Connecté : ${nomComplet}`
                : "Connecté";

    }


    return administrateur;

}


// ------------------------------------------------------
// DECONNEXION
// ------------------------------------------------------

async function deconnecterAdministrateur() {

    const { error } = await supabaseClient.auth.signOut();

    if (error) {

        console.error("Erreur déconnexion :", error);

        return false;
    }

    window.location.replace("./index.html");

    return true;

}


// ------------------------------------------------------
// SUIVRE LA SESSION EN TEMPS REEL
// ------------------------------------------------------
// Si la session expire ou si l'utilisateur se déconnecte
// dans un autre onglet, on quitte immédiatement la page
// protégée au lieu de laisser une interface admin ouverte.

supabaseClient.auth.onAuthStateChange(function (evenement, session) {

    if (evenement === "SIGNED_OUT" || (evenement === "TOKEN_REFRESHED" && !session)) {

        redirigerVersConnexionAdmin();

    }

});
