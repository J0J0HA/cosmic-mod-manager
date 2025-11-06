import type { PrivacyProps } from "~/locales/en/legal/privacy";

export function PrivacyPolicy(props: PrivacyProps) {
         return `
# ${props.title}

Diese Übersetzung nicht rechtlich bindend! Es gilt die englische Originalversion, dieses Dokument soll lediglich das Verständnis für deutschsprachige Nutzer vereinfachen.

*Zuletzt verändert (Deutsche Übersetzung): 06.11.2025*

### **Einleitung**

${props.siteName_Long} (${props.siteName_Short}) wird von einer Gruppe von Entwicklern und Verwaltern (nachfolgend "wir", "unser"). Diese Datenschutzerklärung erklärt, wie wir Ihre Daten sammeln, nutzen and schützen, wenn Sie unsere Seite, **${props.websiteUrl}** (nachfolgend "Dienst", "Webseite"), besuchen. Sie fasst außerdem Ihre Rechte in Bezug auf Ihre Daten zusammen.

Mit der Benutzung unseres Dienstes stimmen Sie zu, dass wir Ihre Daten wie im Folgenden beschrieben Sammeln und Nutzen. Wenn Sie diesen Regelungen nicht zustimmen möchten, nutzen Sie unsere Website bitte nicht.

Diese Datenschutzerklärung kann sich von Zeit zu Zeit verändern; entsprechende Änderungen werden auf dieser Seite mit einem veränderten "Zuletzt verändert"-Datum angegeben.

### **Welche Daten sammeln wir?**

#### **Nutzerdaten**

Wenn Sie bei ${props.siteName_Short} ein Konto erstelln, sammeln wir folgende Daten:

* **Email-Adresse** (für Registrierung und Kommunikation verwendet)
* **Nutzername** (zur eindeutigen Identifizierung)
* **Profilbild** (falls angegeben)
* **Name** (falls angegeben)
* **Zeitstempel der Kontoerstellung**

Wenn sich ein Nutzer anmeldet, also eine Sitzung erstellt wird, werden folgende Daten in Verbindung mit der Sitzung gespeichert:
* **Auth-Provider** (falls gegeben; der Drittanbieter, mit dem Sie sich angemeldet haben)
* **IP-Addresse** (aus Sicherheitsgründen)
* **Standort** (Basierend auf der IP-Adresse, aus Sicherheitsgründen)
* **User-Agent** (nformationen über Browser und Betriebssystem, aus Sicherheitsgründen)
* **Zeitstempel des Logins**
* **Zeitstempel der letzten Aktivität** (Das letzte mal, dass sich mit dieser Sitzung authentifiziert wurde)

Es sollte angemerk werden, dass diese Sitzungs-Daten nur für die Dauer der Sitzung gespeichtert wird und dem Nutzer jederzeit auf der Seite der [Sitzungs-Einstellungen](${props.sessionSettings_PageUrl}) sichtbar sind.

Wir speichern weiterhin Informationen über:

* **Auth-Konten** (verknüpfte Konten von Drittanbietern wie Google, GitHub, Discord, oder GitLab)
* **Passwort-Hash des Nutzers** (wenn der Nutzer ein Passwort für sein Konto festlegt)

#### **Datensammlung durch Drittanbieter**

Wir nutzen Drittanbieter für unsere Infrastruktur; unter anderem:

* **Cloudflare**
* **Fastly**
* **Backblaze**

Diese Dienste helfen uns, die Performance, Sicherheit und Verfügbarkeit unseres Dienstes sicherzustellen.

Wir self-hosten weiterhin Software wie **Clickhouse DB**, **Postgresql**, **Valkey** und **Meilisearch** zum Verwalten von Datenbanken sowie für andere interne Funktionen.

#### **eine Monetarisierung**

Wir monetarisieren keine Nutzerdaten und haben das zu diesem Zeitpunkt auch nicht vor.

### **atenspeicherdauer**

Wir speichern Daten so lang, wie es für die Bereitstellung unseres Dienstes notwendig ist. Sie können die Löschung Ihrer Daten jederzeit anfordern. Einmal gelöscht, sind Ihre Daten nicht mehr verfügbar, in Backup-Systemen jedoch noch für einen kurzen Zeitram vorhanden.

### **Ihre Rechte**

Sie haben jederzeit das Recht, die Löschung Ihrer personenbezogenen Daten von unseren Systemen zu beantragen. Wir geben jedoch keinen vollen Zugriff auf die gespeicherten Daten, da ein Großteil dieser _is what you've already provided_.

Um die Löschung Ihrer Daten zu beantragen, kontaktieren Sie uns bitte unter **[${props.supportEmail}](mailto:${props.supportEmail})** oder gehen Sie in Ihre **[Kontoeinstellungen](${props.accountSettings_PageUrl})**, blättern sie bis zu "Konto löchen" und folgen sie den gezeigten Schritten.

### **Dienste von Drittanbietern**

Wir teilen Ihre personenbezogenen Daten nicht zu Marketinkzwecken mit Dinstbereitstellern oder Drittanbietern. Unsere Drittanbieter sind unter anderem:

* **Cloudflare** (für Performance und Sicherheit)
* **Fastly** (zur Inhaltsbereitstellung)
* **Backblaze** (zum Speichern von Backups)

### **Privatsphäre von Kindern**

Wir sammeln nicht im Speziellen personenbezogenen Daten von Kindern unter 13 Jahren. Unser Dienst ist nicht an Kinder gerichtet und wir empfehlen Eltern und Erziehungsberechtigten, das Onlineverhalten ihrer Kinder zu überwachen und kontrollieren.

Wenn wir darauf aufmerksam werde, dass ein Kind unter dem Alter von 13 Jahren persönliche Informationen angegeben hat, geben wir uns jede Mühe, diese Informationen auf unseren Systemen zu entfernen.

### **Cookies**

Wir verwenden Cookies u,:

* Sie in Ihrem Konto anzumelden
* Ihre kosmetischen Vorlieben zu speichern

Sie können Ihren Browser so einstellen, dass dieser Cookies blockiert oder sie über ihre Verwendung informiert. Das daktivieren von Cookies kann jedoch Funktionen der Website einschränken.

### **nderungen an der Datenschutzerklärung**

Diese Datenschutzerklärung kann sich von Zeit zu Zeit verändern; entsprechende Änderungen werden auf dieser Seite mit einem veränderten "Zuletzt verändert"-Datum angegeben. Ihre fortlaufende Verwendung unserer Website wird als Akzeptanz der aktualisierten Datenschutzerklärung gewertet.

### **Kontaktieren Sie uns**

Wenn Sie irgendwelche Fragen über diese Datenschutzerklärung oder darüber, wie wir Ihre Daten behandeln, haben, kontaktieren Sie und bitte unter [${props.supportEmail}](mailto:${props.supportEmail}).
`;
}
