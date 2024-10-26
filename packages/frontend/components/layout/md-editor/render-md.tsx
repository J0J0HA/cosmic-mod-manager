import hljs from "highlight.js/lib/core";
// Configs
import gradle from "highlight.js/lib/languages/gradle";
import groovy from "highlight.js/lib/languages/groovy";
import ini from "highlight.js/lib/languages/ini";
// Coding
import java from "highlight.js/lib/languages/java";
// Scripting
import "@/components/layout/md-editor/highlightjs.css";
import { cn } from "@/lib/utils";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import lua from "highlight.js/lib/languages/lua";
import properties from "highlight.js/lib/languages/properties";
import python from "highlight.js/lib/languages/python";
import scala from "highlight.js/lib/languages/scala";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { configuredXss, md } from "./parse-md";

/* REGISTRATION */
// Scripting
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("lua", lua);
// Coding
hljs.registerLanguage("java", java);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("scala", scala);
hljs.registerLanguage("groovy", groovy);
// Configs
hljs.registerLanguage("gradle", gradle);
hljs.registerLanguage("json", json);
hljs.registerLanguage("ini", ini);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("properties", properties);

/* ALIASES */
// Scripting
hljs.registerAliases(["js"], { languageName: "javascript" });
hljs.registerAliases(["ts"], { languageName: "typescript" });
hljs.registerAliases(["py"], { languageName: "python" });
// Coding
hljs.registerAliases(["kt"], { languageName: "kotlin" });
// Configs
hljs.registerAliases(["json5"], { languageName: "json" });
hljs.registerAliases(["toml"], { languageName: "ini" });
hljs.registerAliases(["yml"], { languageName: "yaml" });
hljs.registerAliases(["html", "htm", "xhtml", "mcui", "fxml"], { languageName: "xml" });

export const renderHighlightedString = (string: string) =>
    configuredXss.process(
        md({
            highlight: (str: string, lang: string) => {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(str, { language: lang }).value;
                    } catch (__) {}
                }

                return "";
            },
        }).render(string),
    );

export const MarkdownRenderBox = ({ text, className }: { text: string; className?: string }) => {
    const navigate = useNavigate();

    // Use React router to handle internal links
    function handleNavigate(e: MouseEvent) {
        try {
            if (!(e.target instanceof HTMLAnchorElement)) return;

            const target = e.target as HTMLAnchorElement;
            const targetUrl = new URL(target.href);

            if (targetUrl.origin !== window.location.origin) return;

            e.preventDefault();
            navigate(`${target.pathname}${target.search}`);
        } catch {}
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        document.addEventListener("click", handleNavigate);

        return () => {
            document.removeEventListener("click", handleNavigate);
        };
    }, []);

    return (
        <div
            className={cn("w-full overflow-auto markdown-body", className)}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{ __html: renderHighlightedString(text) }}
        />
    );
};

export default MarkdownRenderBox;
