import UIKit
import WebKit
import AVFoundation

/// Hra běží ve WKWebView ze souborů v balíčku (www/). Most „window.Android“ je stejný jako na Androidu:
/// speak(text, queue), stopSpeak(), vibrate(ms) – mluví český hlas iPhonu, vibrace přes haptiku.
final class GameViewController: UIViewController, WKScriptMessageHandler, WKUIDelegate {
    private var web: WKWebView!
    private let synth = AVSpeechSynthesizer()

    override func loadView() {
        let cfg = WKWebViewConfiguration()
        cfg.allowsInlineMediaPlayback = true
        cfg.mediaTypesRequiringUserActionForPlayback = []
        let shim = """
        window.Android = {
          speak: function (t, q) { window.webkit.messageHandlers.zoubky.postMessage({ a: 'speak', t: String(t), q: !!q }); },
          stopSpeak: function () { window.webkit.messageHandlers.zoubky.postMessage({ a: 'stop' }); },
          vibrate: function (ms) { window.webkit.messageHandlers.zoubky.postMessage({ a: 'vib', ms: ms | 0 }); }
        };
        """
        cfg.userContentController.addUserScript(WKUserScript(source: shim, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        cfg.userContentController.add(self, name: "zoubky")
        web = WKWebView(frame: .zero, configuration: cfg)
        web.uiDelegate = self
        web.isOpaque = false
        web.backgroundColor = UIColor(red: 0.5, green: 0.83, blue: 1, alpha: 1)
        web.scrollView.isScrollEnabled = false
        web.scrollView.bounces = false
        web.scrollView.contentInsetAdjustmentBehavior = .never
        view = web
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        if let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") {
            web.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        }
    }

    override var prefersStatusBarHidden: Bool { true }
    override var prefersHomeIndicatorAutoHidden: Bool { true }
    override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge { .all }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .landscape }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let d = message.body as? [String: Any], let a = d["a"] as? String else { return }
        switch a {
        case "speak":
            if !(d["q"] as? Bool ?? false) { synth.stopSpeaking(at: .immediate) }
            let u = AVSpeechUtterance(string: d["t"] as? String ?? "")
            u.voice = AVSpeechSynthesisVoice(language: "cs-CZ")
            u.rate = AVSpeechUtteranceDefaultSpeechRate * 0.92
            u.pitchMultiplier = 1.15
            synth.speak(u)
        case "stop":
            synth.stopSpeaking(at: .immediate)
        case "vib":
            UIImpactFeedbackGenerator(style: (d["ms"] as? Int ?? 30) > 60 ? .heavy : .light).impactOccurred()
        default:
            break
        }
    }

    // window.prompt() – rodič zadává vlastní jméno dítěte
    func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
        let ac = UIAlertController(title: nil, message: prompt, preferredStyle: .alert)
        ac.addTextField { $0.text = defaultText }
        ac.addAction(UIAlertAction(title: "Zrušit", style: .cancel) { _ in completionHandler(nil) })
        ac.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(ac.textFields?.first?.text) })
        present(ac, animated: true)
    }
}
