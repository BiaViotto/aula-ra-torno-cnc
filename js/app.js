document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =========================================================
           1. REFERÊNCIAS À CENA DE RA
        ========================================================== */

        const scene =
            document.querySelector("#ar-scene");

        const target =
            document.querySelector("#target");

        const cameraElement =
            document.querySelector("#ar-camera");


        /* =========================================================
           2. REFERÊNCIAS À INTERFACE
        ========================================================== */

        const status =
            document.querySelector("#status");

        const badge =
            document.querySelector("#badge");

        const panel =
            document.querySelector("#info-panel");

        const panelTitle =
            document.querySelector("#info-title");

        const panelText =
            document.querySelector("#info-text");

        const panelDetail =
            document.querySelector("#info-detail");

        const closeButton =
            document.querySelector("#close-panel");


        /*
           Busca todos os hotspots.
        */

        const hotspots =
            Array.from(
                document.querySelectorAll(".hotspot")
            );


        /*
           Indica se o target está sendo rastreado.
        */

        let tracking = false;


        /* =========================================================
           3. BASE DE INFORMAÇÕES
        ========================================================== */

        const information = {

            /* -----------------------------------------------------
               HOTSPOT 1
            ----------------------------------------------------- */

            placa: {

                title:
                    "Cabeçote e placa",

                text:
                    "A placa fixa a peça e o cabeçote fornece o movimento de rotação necessário ao torneamento.",

                detail:
                    "A fixação correta é essencial para precisão e segurança."
            },


            /* -----------------------------------------------------
               HOTSPOT 2
            ----------------------------------------------------- */

            torre: {

                title:
                    "Torre de ferramentas",

                text:
                    "A torre organiza as ferramentas de corte e permite selecionar a ferramenta necessária em cada etapa do programa CNC.",

                detail:
                    "A indexação da torre pode integrar a sequência automática de usinagem."
            },


            /* -----------------------------------------------------
               HOTSPOT 3
            ----------------------------------------------------- */

            comando: {

                title:
                    "Painel de comando CNC",

                text:
                    "O painel é a interface entre operador, programa CNC e sistema de controle da máquina.",

                detail:
                    "Os dados apresentados nesta experiência são didáticos."
            },


            /* -----------------------------------------------------
               HOTSPOT 4
            ----------------------------------------------------- */

            seguranca: {

                title:
                    "Proteção e segurança",

                text:
                    "Portas, proteções e intertravamentos ajudam a separar o operador da região de usinagem.",

                detail:
                    "A Realidade Aumentada não substitui treinamento ou documentação do fabricante."
            },


            /* -----------------------------------------------------
               HOTSPOT 5 - DESAFIO
            ----------------------------------------------------- */

            barramento: {

                title:
                    "Barramento do torno",

                text:
                    "O barramento é a estrutura que serve de apoio e guia para os componentes móveis do torno.",

                detail:
                    "Sua posição e movimentação devem ser consideradas durante a operação da máquina."
            }

        };


        /* =========================================================
           4. FUNÇÃO PARA ABRIR O PAINEL
        ========================================================== */

        function showInformation(topicName) {

            const selected =
                information[topicName];


            /*
               Verifica se existe informação
               para o hotspot selecionado.
            */

            if (!selected) {
                return;
            }


            panelTitle.textContent =
                selected.title;

            panelText.textContent =
                selected.text;

            panelDetail.textContent =
                selected.detail;


            /*
               Mostra o painel.
            */

            panel.classList.remove(
                "hidden"
            );
        }


        /* =========================================================
           5. FUNÇÃO PARA FECHAR O PAINEL
        ========================================================== */

        function hideInformation() {

            panel.classList.add(
                "hidden"
            );
        }


        /* =========================================================
           6. EVENTOS DOS HOTSPOTS
        ========================================================== */

        hotspots.forEach(
            (button) => {

                button.addEventListener(
                    "pointerup",
                    (event) => {

                        event.preventDefault();

                        event.stopPropagation();


                        /*
                           Lê o data-topic
                           do botão.
                        */

                        const topicName =
                            button.dataset.topic;


                        /*
                           Abre a informação
                           correspondente.
                        */

                        showInformation(
                            topicName
                        );
                    }
                );
            }
        );


        /* =========================================================
           7. BOTÃO FECHAR
        ========================================================== */

        closeButton.addEventListener(
            "pointerup",
            (event) => {

                event.preventDefault();

                hideInformation();
            }
        );


        /* =========================================================
           8. MINDAR PRONTO
        ========================================================== */

        scene.addEventListener(
            "arReady",
            () => {

                status.textContent =
                    "Câmera pronta. Aponte para a imagem do torno.";

                badge.textContent =
                    "PROCURANDO ALVO";
            }
        );


        /* =========================================================
           9. ERRO AO INICIAR RA
        ========================================================== */

        scene.addEventListener(
            "arError",
            () => {

                status.textContent =
                    "Não foi possível iniciar a câmera.";

                badge.textContent =
                    "ERRO";
            }
        );


        /* =========================================================
           10. TARGET ENCONTRADO
        ========================================================== */

        target.addEventListener(
            "targetFound",
            () => {

                tracking = true;


                status.textContent =
                    "Torno reconhecido. Toque em um ponto numerado.";


                badge.textContent =
                    "● RA ATIVA";


                /*
                   Mostra todos os hotspots.
                */

                hotspots.forEach(
                    (button) => {

                        button.classList.add(
                            "visible"
                        );
                    }
                );
            }
        );


        /* =========================================================
           11. TARGET PERDIDO
        ========================================================== */

        target.addEventListener(
            "targetLost",
            () => {

                tracking = false;


                status.textContent =
                    "Alvo perdido. Aponte novamente para a imagem.";


                badge.textContent =
                    "PROCURANDO ALVO";


                /*
                   Esconde os hotspots.
                */

                hotspots.forEach(
                    (button) => {

                        button.classList.remove(
                            "visible"
                        );
                    }
                );


                /*
                   Fecha o painel.
                */

                hideInformation();
            }
        );


        /* =========================================================
           12. CONVERTER POSIÇÃO 3D EM POSIÇÃO 2D
        ========================================================== */

        function updateHotspotPositions() {

            /*
               Agenda a próxima atualização.
            */

            requestAnimationFrame(
                updateHotspotPositions
            );


            /*
               Não calcula se o target
               não estiver sendo rastreado.
            */

            if (!tracking) {
                return;
            }


            /*
               Obtém a câmera Three.js
               utilizada pelo A-Frame.
            */

            const camera =
                cameraElement.getObject3D(
                    "camera"
                );


            /*
               Aguarda a inicialização.
            */

            if (
                !camera ||
                !target.object3D
            ) {
                return;
            }


            /*
               Atualiza as matrizes.
            */

            target.object3D.updateMatrixWorld(
                true
            );

            camera.updateMatrixWorld(
                true
            );


            /*
               Atualiza cada hotspot.
            */

            hotspots.forEach(
                (button) => {

                    /*
                       Obtém X, Y e Z
                       do HTML.
                    */

                    const localPoint =
                        new THREE.Vector3(

                            Number(
                                button.dataset.x
                            ),

                            Number(
                                button.dataset.y
                            ),

                            Number(
                                button.dataset.z
                            )
                        );


                    /*
                       Converte as coordenadas
                       locais para o mundo 3D.
                    */

                    const worldPoint =
                        target.object3D.localToWorld(
                            localPoint
                        );


                    /*
                       Projeta o ponto pela câmera.
                    */

                    const projectedPoint =
                        worldPoint
                            .clone()
                            .project(camera);


                    /*
                       Converte para pixels da tela.
                    */

                    const screenX =
                        (
                            projectedPoint.x *
                            0.5 +
                            0.5
                        ) *
                        window.innerWidth;


                    const screenY =
                        (
                            -projectedPoint.y *
                            0.5 +
                            0.5
                        ) *
                        window.innerHeight;


                    /*
                       Posiciona o botão.
                    */

                    button.style.left =
                        `${screenX}px`;

                    button.style.top =
                        `${screenY}px`;


                    /*
                       Verifica se o ponto
                       está dentro da tela.
                    */

                    const insideScreen =
                        projectedPoint.z > -1 &&
                        projectedPoint.z < 1 &&
                        screenX > -80 &&
                        screenX <
                            window.innerWidth + 80 &&
                        screenY > -80 &&
                        screenY <
                            window.innerHeight + 80;


                    /*
                       Mostra ou esconde
                       conforme a posição.
                    */

                    button.style.visibility =
                        insideScreen
                            ? "visible"
                            : "hidden";
                }
            );
        }


        /* =========================================================
           13. INICIA A ATUALIZAÇÃO
        ========================================================== */

        updateHotspotPositions();

    }
);