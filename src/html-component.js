// Base class for creating Web Components
window.HTMLComponent = class HTMLComponent extends HTMLElement {

	get is() {
		return this.nodeName.toLowerCase()
	}

	// Required by the custom elements polyfill
	constructor(_) {
		return (_ = super(_)).init(), _;
	}

	init() { /* override on custom elements */ }

	static create(props) {
		return new this().set(props)
	}

	// Shortcut for addEventListener with support for event delegation
	on(eventName, selector, callback) {

		this.addEventListener(eventName, e => {
			if (arguments.length == 2) {
				callback = selector
				handleEvent(e, this)
			} else if (e.target.matches(selector)) {
				handleEvent(e, this)
			}
		})

		function handleEvent(e, self) {
			if (self._before) self._before(e)
			callback(e)
			if (self._after) self._after(e)
		}

		return this
  }

	off(e) {
		this.removeEventListener(e)
	}

	// Sets a listener to run after all events subscribed with .on
	beforeEach(handler) {
		this._before = handler
		return this
	}

	// Sets a listener to run after all events subscribed with .on
	afterEach(handler) {
		this._after = handler
		return this
	}

	// Publish events to notify parents of internal changes
	publish(eventName, data) {
		this.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: data
		}))
	}

	// Shortcut for getAttribute, with a basic type conversion
	get(name) {
		var value = this.getAttribute(name)
		if (value.match(/^(true|false|undefined)$/))
			value = value == 'true'
		else if (!isNaN(value))
			value = Number(value)
		return value
	}

	// Shortcut for setAttribute, automatically re-render the view
	set(data) {
		for(var name in data) {
			var value = data[name]
			this.setAttribute(name, value)
		}
		return this.render()
	}

	// Mounts a hash with all attributes
	get props() {
		var s = {}
		var props = this.attributes
		for(var i = props.length - 1; i >= 0; i--) {
			var prop = props[i].name
			s[prop] = this.get(prop)
		}
		return s
	}

	show() { this.classList.remove('hidden') }
	hide() { this.classList.add('hidden') }
	toggle(showOrHide) { this.classList.toggle('hidden', showOrHide) }

	// Render template with props and replaces inner html
	render() {
		// Optionally mark a section to not be replaced on re-renders
		var fixed = this.query('[fixed]')
		// Helper function for innerHTML, required by the custom elements polyfill
		innerHTML(this, this.template(this.props))
		if (fixed) {
			this.query('[fixed]').replaceWith(fixed)
		}
		return this
	}

	static register(tagName) {
		customElements.define(tagName, this)
		// scope the styles and add them to head
		registerStyles(tagName, this.styles)
		// ensure element is accessible on global scope
		window[this.name] = this
	}
}

// Tagged templates for activating syntax highlighting
// http://www.2ality.com/2015/01/template-strings-html.html
window.html = function html(literalSections, ...substs) {
  // Use raw literal sections: we don’t want
  // backslashes (\n etc.) to be interpreted
  let raw = literalSections.raw;

  let result = '';

  substs.forEach((subst, i) => {
    // Retrieve the literal section preceding
    // the current substitution
    let lit = raw[i];

    // In the example, map() returns an array:
    // If substitution is an array (and not a string),
    // we turn it into a string
    if (Array.isArray(subst)) {
      subst = subst.join('');
    }

    // If the substitution is preceded by a dollar sign,
    // we escape special characters in it
		if (lit.endsWith('$')) {
		  subst = htmlEscape(subst);
      lit = lit.slice(0, -1);
    }
    result += lit;
    result += subst;
  });
  // Take care of last literal section
  // (Never fails, because an empty template string
  // produces one literal section, an empty string)
  result += raw[raw.length-1]; // (A)

  return result;
}

function htmlEscape(str) {
		if (!str) return '';
    return str.replace(/&/g, '&amp;') // first!
              .replace(/>/g, '&gt;')
              .replace(/</g, '&lt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;')
              .replace(/`/g, '&#96;');
}

// Tagged template helper to enable syntax highlighting
window.csjs = function css(stylesheet, ...expressions) {
	return stylesheet.reduce((accumulator, part, i) => {
    return accumulator + expressions[i - 1] + part
  })
}

// Scope css and write style tag to head
function registerStyles(tagName, styles) {
	if (!styles) return
	var styleTag = document.createElement('style')
	styleTag.innerHTML = scopeCss(styles.trim(), tagName)
	document.head.appendChild(styleTag)
}

/*
	Scope a css block to a parent selector
 	e.g.
		 :host { display: block }
	   .foo { color: blue }
	becomes
	  my-component { display: block }
		my-component .foo { color: blue }

  https://github.com/dfcreative/scope-css
*/
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

// Helper required by the custom elements polyfill
// Ensures elements created with a template string are immediately upgraded to custom elements
/*! (C) Andrea Giammarchi - @WebReflection - Mit Style License */
// see https://github.com/WebReflection/document-register-element/issues/21#issuecomment-102020311
window.innerHTML=function(e){var t="extends",n=e.registerElement,r=e.createElement("div"),i="document-register-element",s=n.innerHTML,o,u;if(s)return s;try{n.call(e,i,{prototype:Object.create(HTMLElement.prototype,{createdCallback:{value:Object}})}),r.innerHTML="<"+i+"></"+i+">";if("createdCallback"in r.querySelector(i))return n.innerHTML=function(e,t){return e.innerHTML=t,e}}catch(a){}return u=[],o=function(t){if("createdCallback"in t||"attachedCallback"in t||"detachedCallback"in t||"attributeChangedCallback"in t)return;e.createElement.innerHTMLHelper=!0;for(var n=t.parentNode,r=t.getAttribute("is"),i=t.nodeName,s=e.createElement.apply(e,r?[i,r]:[i]),o=t.attributes,u=0,a=o.length,f,l;u<a;u++)f=o[u],s.setAttribute(f.name,f.value);s.createdCallback&&(s.created=!0,s.createdCallback(),s.created=!1);while(l=t.firstChild)s.appendChild(l);e.createElement.innerHTMLHelper=!1,n&&n.replaceChild(s,t)},(e.registerElement=function(i,s){var o=(s[t]?s[t]+'[is="'+i+'"]':i).toLowerCase();return u.indexOf(o)<0&&u.push(o),n.apply(e,arguments)}).innerHTML=function(e,t){e.innerHTML=t;for(var n=e.querySelectorAll(u.join(",")),r=n.length;r--;o(n[r]));return e}}(document);
