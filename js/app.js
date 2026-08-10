/*
 * BOLETIM CARIOCA
 * Aplicação principal
 */

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Boletim Carioca iniciado.");

    try {

        const {
            data: {
                session
            },
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            console.error(
                "Erro ao verificar sessão:",
                error
            );

            return;
        }

        if (session) {

            console.log(
                "Usuário autenticado:",
                session.user.email
            );

        } else {

            console.log(
                "Nenhum usuário autenticado."
            );

        }

    } catch (error) {

        console.error(
            "Erro ao iniciar aplicação:",
            error
        );

    }

});
