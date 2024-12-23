{{- define "ip-reverse-app.name" -}}
{{ include "ip-reverse-app.chart" . }}
{{- end }}

{{- define "ip-reverse-app.chart" -}}
{{ .Chart.Name }}
{{- end }}

{{- define "ip-reverse-app.fullname" -}}
{{ include "ip-reverse-app.name" . }}-{{ .Release.Name }}
{{- end }}