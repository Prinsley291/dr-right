// ==========================================
// DR. RIGHT - APP.JS
// ==========================================


// Client Supabase partagé
const supabase = supabaseClient;

// ==========================================
// FONCTION : AFFICHER UN MESSAGE
// ==========================================

function afficherMessage(
    elementId,
    message
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            message;

    }

}


// ==========================================
// CONNEXION ADMINISTRATEUR
// ==========================================

const formulaireAdmin =
    document.getElementById(
        "form-connexion-admin"
    );


if (formulaireAdmin) {

    formulaireAdmin.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "email-admin"
                    )
                    .value
                    .trim();


            const motDePasse =
                document
                    .getElementById(
                        "mot-de-passe-admin"
                    )
                    .value;


            if (
                !email ||
                !motDePasse
            ) {

                afficherMessage(
                    "message-connexion",
                    "Veuillez remplir tous les champs."
                );

                return;

            }


            afficherMessage(
                "message-connexion",
                "Connexion en cours..."
            );


            const resultat =
                await supabase
                    .auth
                    .signInWithPassword({

                        email:
                            email,

                        password:
                            motDePasse

                    });


            const data =
                resultat.data;


            const error =
                resultat.error;


            if (error) {

                console.error(
                    "Erreur de connexion :",
                    error
                );


                afficherMessage(
                    "message-connexion",
                    "Email ou mot de passe incorrect."
                );

                return;

            }


            if (
                !data ||
                !data.user
            ) {

                afficherMessage(
                    "message-connexion",
                    "Impossible de connecter cet utilisateur."
                );

                return;

            }


            // ==========================================
            // VERIFICATION ADMINISTRATEUR
            // ==========================================

            const resultatAdmin =
                await supabase

                    .from(
                        "administrateurs"
                    )

                    .select("*")

                    .eq(
                        "auth_user_id",
                        data.user.id
                    )

                    .eq(
                        "statut",
                        "actif"
                    )

                    .maybeSingle();


            const administrateur =
                resultatAdmin.data;


            const erreurAdministrateur =
                resultatAdmin.error;


            if (
                erreurAdministrateur ||
                !administrateur
            ) {

                console.error(
                    "Erreur administrateur :",
                    erreurAdministrateur
                );


                await supabase
                    .auth
                    .signOut();


                afficherMessage(
                    "message-connexion",
                    "Ce compte n'est pas autorisé comme administrateur actif."
                );

                return;

            }


            // ==========================================
            // CONNEXION REUSSIE
            // ==========================================

            afficherMessage(
                "message-connexion",
                "Connexion réussie."
            );


            window.location.href =
                "administrateur.html";

        }
    );

}


// ==========================================
// RECUPERER LA SESSION
// ==========================================

async function obtenirSession() {

    const resultat =
        await supabase
            .auth
            .getSession();


    if (resultat.error) {

        console.error(
            "Erreur session :",
            resultat.error
        );


        return null;

    }


    return resultat.data.session;

}


// ==========================================
// PROTECTION DES PAGES ADMINISTRATEUR
// ==========================================

async function protegerPageAdministrateur() {

    const session =
        await obtenirSession();


    if (!session) {

        window.location.href =
            "connexion-administrateur.html";

        return;

    }


    const resultat =
        await supabase

            .from(
                "administrateurs"
            )

            .select("*")

            .eq(
                "auth_user_id",
                session.user.id
            )

            .eq(
                "statut",
                "actif"
            )

            .maybeSingle();


    const administrateur =
        resultat.data;


    const error =
        resultat.error;


    if (
        error ||
        !administrateur
    ) {

        console.error(
            "Accès administrateur refusé :",
            error
        );


        await supabase
            .auth
            .signOut();


        window.location.href =
            "connexion-administrateur.html";

        return;

    }


    const bienvenue =
        document.getElementById(
            "admin-bienvenue"
        );


    if (bienvenue) {

        const nomComplet =
            `${administrateur.prenom || ""} ${administrateur.nom || ""}`
                .trim();


        bienvenue.textContent =
            `Bienvenue ${nomComplet}`;

    }

}


// ==========================================
// PAGES ADMINISTRATEUR PROTEGEES
// ==========================================

const pagesAdministrateur = [

    "administrateur.html",
    "etudiants.html",
    "operations.html",
    "produits.html",
    "compagnies.html",
    "rapports.html"

];


const pageActuelle =
    window.location.pathname
        .split("/")
        .pop();


if (
    pagesAdministrateur.includes(
        pageActuelle
    )
) {

    protegerPageAdministrateur();

}


// ==========================================
// DECONNEXION
// ==========================================

const boutonDeconnexion =
    document.getElementById(
        "bouton-deconnexion"
    );


if (boutonDeconnexion) {

    boutonDeconnexion.addEventListener(
        "click",
        async function () {

            const resultat =
                await supabase
                    .auth
                    .signOut();


            if (resultat.error) {

                console.error(
                    "Erreur déconnexion :",
                    resultat.error
                );


                alert(
                    "Impossible de se déconnecter."
                );


                return;

            }


            window.location.href =
                "index.html";

        }
    );

}


// ==========================================
// GESTION DES COMPAGNIES
// ==========================================

const listeCompagnies =
    document.getElementById(
        "liste-compagnies"
    );


if (listeCompagnies) {


    // ==========================================
    // ORDRE LOGIQUE DES COMPAGNIES
    // ==========================================

    const ordreCompagnies = {

        "premiere": 1,
        "premier": 1,

        "deuxieme": 2,
        "second": 2,
        "seconde": 2,

        "troisieme": 3,

        "quatrieme": 4,

        "cinquieme": 5,

        "sixieme": 6,

        "septieme": 7,

        "huitieme": 8,

        "neuvieme": 9,

        "dixieme": 10,

        "onzieme": 11,

        "douzieme": 12,

        "treizieme": 13,

        "quatorzieme": 14,

        "quinzieme": 15,

        "seizieme": 16,

        "dix-septieme": 17,

        "dix-huitieme": 18,

        "dix-neuvieme": 19,

        "vingtieme": 20

    };


    // ==========================================
    // TROUVER LE NUMERO D'UNE COMPAGNIE
    // ==========================================

    function obtenirNumeroCompagnie(
        nom
    ) {

        if (!nom) {

            return 9999;

        }


        const nomNormalise =
            nom

                .toLowerCase()

                .normalize("NFD")

                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                )

                .trim();


        // ------------------------------------------
        // Noms écrits en toutes lettres
        // ------------------------------------------

        for (
            const mot in ordreCompagnies
        ) {

            if (
                nomNormalise.startsWith(
                    mot
                )
            ) {

                return ordreCompagnies[
                    mot
                ];

            }

        }


        // ------------------------------------------
        // Noms commençant par un chiffre
        // Exemple : "1ère cie", "2e cie"
        // ------------------------------------------

        const nombre =
            nomNormalise.match(
                /^\d+/
            );


        if (nombre) {

            return Number(
                nombre[0]
            );

        }


        return 9999;

    }


    // ==========================================
    // CHARGER LES COMPAGNIES
    // ==========================================

    async function chargerCompagnies() {

        listeCompagnies.innerHTML =
            "Chargement des compagnies...";


        const {
            data: compagnies,
            error
        } = await supabase

            .from(
                "compagnies"
            )

            .select(
                `
                    id,
                    created_at,
                    nom
                `
            );


        if (error) {

            console.error(
                "Erreur chargement compagnies :",
                error
            );


            listeCompagnies.innerHTML =
                "<p>Impossible de charger les compagnies.</p>";


            return;

        }


        // ==========================================
        // TRI DES COMPAGNIES
        // ==========================================

        compagnies.sort(
            function (a, b) {

                const numeroA =
                    obtenirNumeroCompagnie(
                        a.nom
                    );


                const numeroB =
                    obtenirNumeroCompagnie(
                        b.nom
                    );


                if (
                    numeroA !== numeroB
                ) {

                    return (
                        numeroA -
                        numeroB
                    );

                }


                return (
                    (a.nom || "")
                        .localeCompare(
                            b.nom || "",
                            "fr"
                        )
                );

            }
        );


        // ==========================================
        // AFFICHER LES COMPAGNIES
        // ==========================================

        listeCompagnies.innerHTML =
            "";


        if (
            !compagnies ||
            compagnies.length === 0
        ) {

            listeCompagnies.innerHTML =
                "<p>Aucune compagnie enregistrée.</p>";

            return;

        }


        compagnies.forEach(
            function (compagnie) {

                const carte =
                    document.createElement(
                        "div"
                    );


                carte.className =
                    "carte-compagnie";


                carte.innerHTML = `

                    <h3>
                        ${
                            compagnie.nom ||
                            "Compagnie sans nom"
                        }
                    </h3>

                `;


                listeCompagnies.appendChild(
                    carte
                );

            }
        );

    }


    // ==========================================
    // LANCER LE CHARGEMENT DES COMPAGNIES
    // ==========================================

    chargerCompagnies();

}


// ==========================================
// CONTROLE
// ==========================================

console.log(
    "Dr. Right : app.js chargé correctement."
);