# CuidaDor SUS

Aplicativo web estatico para triagem e apoio ao diagnostico breve de DTM na atencao basica.

## Como abrir

O servidor local esta em:

```text
http://127.0.0.1:5173/
```

Tambem e possivel abrir `index.html` diretamente no navegador.

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
7. Cole essa URL no campo `URL de envio`, no modulo Resultado do app.

Se o endpoint ainda nao estiver configurado, o app mantem o rascunho salvo no navegador.
