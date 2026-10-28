package br.ufpb.labodontodigital.cuidadorsus;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebChromeClient;
import android.webkit.ValueCallback;
import android.webkit.WebViewClient;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.net.ssl.HttpsURLConnection;

public class MainActivity extends Activity {
    private static final String APP_URL = "file:///android_asset/index.html";
    private static final String SUBMISSION_ENDPOINT =
        "https://script.google.com/macros/s/AKfycbwjnRhj4RZyRhilMfVuEPPLo3kIzEmHaNgws8WwTSwQZ-3hs-4dCM0Srl2XKj6PQr6v7w/exec";

    private WebView webView;
    private ValueCallback<Uri[]> fileCallback;
    private final ExecutorService submissionExecutor = Executors.newSingleThreadExecutor();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setStatusBarColor(Color.WHITE);
        getWindow().setNavigationBarColor(Color.WHITE);
        int systemUiFlags = getWindow().getDecorView().getSystemUiVisibility()
            | android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            systemUiFlags |= android.view.View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        }
        getWindow().getDecorView().setSystemUiVisibility(systemUiFlags);

        webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));
        setContentView(webView);
        configureWebView();

        if (savedInstanceState == null) {
            webView.loadUrl(APP_URL);
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(webView, true);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[] {"application/pdf", "image/jpeg", "image/png", "image/webp"});
                intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                try { startActivityForResult(intent, 41); }
                catch (Exception error) { fileCallback.onReceiveValue(null); fileCallback = null; }
                return true;
            }
        });
        webView.addJavascriptInterface(new SubmissionBridge(), "CuidaDorAndroid");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (!request.isForMainFrame()) {
                    return false;
                }

                Uri uri = request.getUrl();
                if ("file".equals(uri.getScheme())) {
                    return false;
                }

                startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }
        });
    }

    private final class SubmissionBridge {
        @JavascriptInterface
        public void sendPayload(String payloadJson) {
            submissionExecutor.execute(() -> submitPayload(payloadJson));
        }
    }

    private void submitPayload(String payloadJson) {
        JSONObject result = new JSONObject();
        HttpsURLConnection connection = null;

        try {
            JSONObject payload = new JSONObject(payloadJson);
            if (payload.optJSONArray("anexosClinicos") != null && payload.getJSONArray("anexosClinicos").length() > 0) {
                HttpsURLConnection probe = (HttpsURLConnection) new java.net.URL(SUBMISSION_ENDPOINT).openConnection();
                try {
                    probe.setConnectTimeout(10000);
                    probe.setReadTimeout(15000);
                    JSONObject info = new JSONObject(readResponse(probe.getInputStream()));
                    if (!info.optBoolean("attachmentsV1", false)) throw new IOException("Atualize a implantação do Apps Script para enviar anexos.");
                } finally { probe.disconnect(); }
            }
            byte[] requestBody = (
                "payload=" + URLEncoder.encode(payloadJson, StandardCharsets.UTF_8.name())
            ).getBytes(StandardCharsets.UTF_8);

            connection = (HttpsURLConnection) new java.net.URL(SUBMISSION_ENDPOINT).openConnection();
            connection.setConnectTimeout(15000);
            connection.setReadTimeout(20000);
            connection.setInstanceFollowRedirects(false);
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty(
                "Content-Type",
                "application/x-www-form-urlencoded; charset=UTF-8"
            );
            connection.setRequestProperty("Accept", "application/json");

            try (OutputStream output = connection.getOutputStream()) {
                output.write(requestBody);
            }

            int responseCode = connection.getResponseCode();
            if (responseCode >= 300 && responseCode < 400) {
                String redirectLocation = connection.getHeaderField("Location");
                if (redirectLocation == null || redirectLocation.isEmpty()) {
                    throw new IOException("Redirecionamento sem endereço de destino.");
                }

                java.net.URL redirectUrl = new java.net.URL(
                    new java.net.URL(SUBMISSION_ENDPOINT),
                    redirectLocation
                );
                connection.disconnect();
                connection = (HttpsURLConnection) redirectUrl.openConnection();
                connection.setConnectTimeout(15000);
                connection.setReadTimeout(20000);
                connection.setInstanceFollowRedirects(true);
                connection.setRequestMethod("GET");
                connection.setRequestProperty("Accept", "application/json");
                responseCode = connection.getResponseCode();
            }

            InputStream responseStream = responseCode >= 200 && responseCode < 400
                ? connection.getInputStream()
                : connection.getErrorStream();
            String responseBody = readResponse(responseStream);

            if (responseCode < 200 || responseCode >= 300) {
                throw new IOException("HTTP " + responseCode);
            }

            if (!responseBody.trim().startsWith("{")) {
                throw new IOException("O Google não confirmou o envio. Verifique se a implantação do Apps Script permite acesso a qualquer pessoa.");
            }
            JSONObject response = new JSONObject(responseBody);
            if (!response.optBoolean("ok", false)) {
                throw new IOException(response.optString("error", "Resposta inválida do servidor."));
            }

            result.put("ok", true);
            result.put("anexosClinicos", response.optJSONArray("anexosClinicos"));
        } catch (Exception error) {
            try {
                result.put("ok", false);
                result.put("error", error.getMessage() == null
                    ? "Não foi possível registrar os dados."
                    : error.getMessage());
            } catch (Exception ignored) {
                return;
            }
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }

        deliverSubmissionResult(result);
    }

    private String readResponse(InputStream input) throws IOException {
        if (input == null) return "";

        try (InputStream stream = input; ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int count;
            while ((count = stream.read(buffer)) != -1) {
                output.write(buffer, 0, count);
            }
            return output.toString(StandardCharsets.UTF_8.name());
        }
    }

    private void deliverSubmissionResult(JSONObject result) {
        String quotedResult = JSONObject.quote(result.toString());
        runOnUiThread(() -> {
            if (webView == null) return;
            webView.evaluateJavascript(
                "window.handleAndroidSubmissionResult(JSON.parse(" + quotedResult + "));",
                null
            );
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 41 && fileCallback != null) {
            Uri[] uris = null;
            if (resultCode == RESULT_OK && data != null) {
                if (data.getClipData() != null) {
                    int count = data.getClipData().getItemCount();
                    uris = new Uri[count];
                    for (int i = 0; i < count; i++) uris[i] = data.getClipData().getItemAt(i).getUri();
                } else if (data.getData() != null) { uris = new Uri[] { data.getData() }; }
            }
            fileCallback.onReceiveValue(uris);
            fileCallback = null;
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        submissionExecutor.shutdownNow();
        webView.destroy();
        webView = null;
        super.onDestroy();
    }
}
