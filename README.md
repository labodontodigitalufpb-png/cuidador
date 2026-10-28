# CuidaDor SUS

Aplicativo web estatico para triagem e apoio ao diagnostico breve de DTM na atencao basica.

## Como abrir

O servidor local esta em:

```text
http://127.0.0.1:5173/
```

Tambem e possivel abrir `index.html` diretamente no navegador.

## Android

A APK instalavel para testes esta em:

```text
CuidaDor-SUS-v1.0.6-debug.apk
```

O projeto Android fica em `android/` e incorpora automaticamente os arquivos
atuais do site. Para gerar novamente a APK:

```bash
cd android
./gradlew :app:assembleDebug
```

O resultado do build fica em
`android/app/build/outputs/apk/debug/app-debug.apk`.

## Modulos

- Identificacao do paciente, unidade e examinador.
- Brief DC/TMD com 14 itens obrigatorios.
- Exame clinico obrigatorio em 4 secoes.
- OHIP-TMD com 22 itens opcionais e escore 0-88.
- Eixo 2 opcional com GCPS e PHQ-4.
- Resultado com diagnostico clinico breve, prioridade e estrategias de manejo.

## Envio dos dados

Para enviar os dados:

1. Acesse `Extensoes > Apps Script`.
2. Cole o conteudo de `google-apps-script.js`.
3. Clique em `Implantar > Nova implantacao`.
4. Escolha `Aplicativo da Web`.
5. Configure `Executar como: voce` e `Quem tem acesso: qualquer pessoa com o link`.
6. Copie a URL final terminada em `/exec`.
7. Configure essa URL na constante `SEND_ENDPOINT` dos dois arquivos `app.js` e `app-20260522-3.js`. No Android, configure também `SUBMISSION_ENDPOINT` em `MainActivity.java` e gere uma nova APK.

Se o endpoint ainda nao estiver configurado, o app mantem o rascunho salvo no navegador.

O navegador só limpa o formulário após receber `ok: true` do servidor. Em caso de erro, o rascunho é preservado. Abra a URL `/exec` no navegador para verificar o acesso à planilha; a resposta deve conter `ok: true`. Após alterar o Apps Script, atualize a implantação com uma nova versão.

## Acompanhamento clínico (alterações de outubro de 2026)

- Identificação: queixa principal e história da doença atual.
- Exame: opções exclusivas “Sem ruídos” e “Sem travamento”.
- Resultado e conduta: atendimentos datados, evolução e reavaliação com os mesmos itens do exame inicial. A comparação mostra a variação das medidas de abertura em milímetros.
- Registros enviados podem ser retomados na identificação, no mesmo navegador/dispositivo. Cada envio cria uma nova linha na planilha e uma cópia local para acompanhamento; a lista local não consulta registros de outros dispositivos.
- Anexos: PDF/JPEG/PNG/WebP, até 2 MB por arquivo e 6 MB no total. Antes do envio, ficam no IndexedDB do dispositivo, separados do rascunho textual. Depois do envio, ficam em uma pasta privada do Drive do proprietário do Apps Script e a planilha recebe nomes e links. O app não publica esses arquivos.

### Ativar anexos no Google Apps Script

1. Na planilha, abra **Extensões > Apps Script**.
2. Substitua o código pelo conteúdo de `google-apps-script.js` (idêntico a `Code.gs`).
3. Execute `getAttachmentFolder` pelo editor e autorize o acesso ao Google Drive solicitado pelo Google. Isso cria a pasta **CuidaDor SUS - Exames e imagens**.
4. Em **Implantar > Gerenciar implantações**, edite a implantação existente, selecione **Nova versão** e implante. Mantenha a URL `/exec`, execução como proprietário e acesso a qualquer pessoa.
5. Abra a URL `/exec` e confirme `"attachmentsV1": true`.

Os novos campos e atendimentos são enviados também ao servidor antigo (atendimentos em JSON). Até atualizar o Apps Script, o envio com arquivos é bloqueado com uma mensagem; o app conserva o formulário e os anexos locais. Não remova os dados do navegador nem desinstale o APK para atualizar.

### Verificação

Execute `node tests/apps-script.test.cjs` para testar a serialização de atendimentos, uploads, limites e limpeza em caso de falha, usando uma planilha e um Drive simulados.
