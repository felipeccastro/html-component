

function loadComps(names) {
  names.trim().split(' ').forEach(name => {
    fetch(`html/${name}.html`)
      .then(resp => resp.text())
      .then(html => registerComponent(name, html))
  })
}

window.templates = {}

// Compile templates, register styles and scripts on load
function registerComponent(name, html) {
  var template = extractTagContent(html, 'template')
  if (template) {
    templates[name] = Hogan.compile(template)
  }

  var style = extractTagContent(html, 'style')
  if (style) {
    var styleTag = document.createElement('style')
    styleTag.innerHTML = scopeCss(style, name)
    document.head.appendChild(styleTag)
  }

  var script = extractTagContent(html, 'script')
  if (script) {
    var scriptTag = document.createElement('script')
    scriptTag.innerHTML = script
    document.head.appendChild(scriptTag)
  }
}

function scopeCss (css, parent) {
	if (!css) return css
	if (!parent) return css

	function replace (css, replacer) {
		//strip block comments
		css = css.replace(/\/\*([\s\S]*?)\*\//g, '')
		return css.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g, replacer)
	}

	css = replace(css, parent + ' $1$2')

	//regexp.escape
	var parentRe = parent.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
	//replace self-selectors
	css = css.replace(new RegExp('(' + parentRe + ')\\s*\\1(?=[\\s\\r\\n,{])', 'g'), '$1')
	//replace `:host` with parent
	css = css.replace(new RegExp('(' + parentRe + ')\\s*:host', 'g'), '$1')
	//revoke wrongly replaced @ statements, like @supports, @import, @media etc.
	css = css.replace(new RegExp('(' + parentRe + ')\\s*@', 'g'), '@')

	return css
}

function extractTagContent(html, tag) {
  var match = html.match("\<"+tag+"\>(.|\n)*?\<\/"+tag+"\>")
  if (!match) return null;
  return match[0].replace(new RegExp("<\/?"+tag+">", "g"), '').trim()
}
