// TODO: consider using jQuery.is() on each node to allow complex bindings expressions?
// TODO: binding of sub templates?

var viewModelBindingProvider = {
  nodeHasBindings: function(node, bindingContext) {
    if (!node.getAttribute) return false; // not an element
    return this.hasBindings(node, bindingContext);
  },

  getBindings: function(node, bindingContext) {
    var viewModel = bindingContext.$data;
    var bindingKeys = this.bindingKeys(node);
    var bindingStrings = [];

    if (node.id == 'contact_form') debugger;


    for (var i = 0, j = bindingKeys.length; i < j; i++) {
      /* var bindingAccessor = viewModel.bindings[bindingKeys[i]]; */
      // TODO: is this really necessary or can we assume that any child contexts have their own bindings defined?
      var bindingAccessor = this.recursiveGetBindingAccessor(bindingKeys[i], bindingContext);
      if (bindingAccessor) bindingStrings.push(bindingAccessor);
    }

    return bindingStrings.length > 0 ? this.parseBindingsString(bindingStrings.join(' '), bindingContext)
    : null;
  },

  recursiveGetBindingAccessor: function(bindingKey, bindingContext){
    var bindingSources = this.bindingSources(bindingContext);
    for(var i = 0, j = bindingSources.length; i < j; i++){
      bindingSource = bindingSources[i];
      if (bindingSource['bindings'] && bindingSource.bindings[bindingKey]){
        return bindingSource.bindings[bindingKey];
      }
    }
    return null;
  },

  // The following function is only used internally by this default provider.
  // It's not part of the interface definition for a general binding provider.
  parseBindingsString: function(bindingsString, bindingContext) {
    try {
      var viewModel = bindingContext['$data'];
      var rewrittenBindings = " { " + ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson(bindingsString) + " } ";
      return ko.utils.evalWithinScope(rewrittenBindings, viewModel === null ? window : viewModel, bindingContext);
    } catch (ex) {
      throw new Error("Unable to parse bindings.\nMessage: " + ex + ";\nBindings value: " + bindingsString);
    }
  },

  // TODO: refactor this to return the actual bindings collections in order of context -> context.$data -> context.$parents
  bindingSources: function(bindingContext) {
    var bs = [].concat.apply([bindingContext]);
    bs = bs.concat(bindingContext.$data ? [bindingContext.$data] : []);
    bs = bs.concat(bindingContext.$parents ? bindingContext.$parents : []);
    return bs;
  },

  hasBindings: function(node, bindingContext){
    var bindingKeys = this.bindingKeys(node);
    var bindingSources = this.bindingSources(bindingContext);

    for(var k = 0, l = bindingKeys.length; k < l; k++){
      var bindingKey = bindingKeys[k];

      for(var i = 0, j = bindingSources.length; i < j; i++){
        var bindingSource = bindingSources[i];
        if (bindingSource['bindings'] && bindingSource.bindings[bindingKey]) return true;
      }
    }

    return false;
  },

  bindingKeys: function(node){
    return [].concat(this.getIdBindingKeys(node),
                     this.getTagBindingKeys(node),
                     this.getClassBindingKeys(node));
  },

  getIdBindingKeys: function(node){
    return node.id ? ['#' + node.id] : [];
  },

  getTagBindingKeys: function(node){
    return node.tagName ? [node.tagName.toLowerCase()] : [];
  },

  getClassBindingKeys: function(node){
    var classes = node.getAttribute("class")
    ? node.getAttribute("class").split(' ')
    : [];

    for (var i = 0, j = classes.length; i < j; i++) {
      classes[i] = '.' + classes[i];
    }

    return classes;
  }

};


