ko.bindingProvider.instance = viewModelBindingProvider

var viewModel = {
  bindings: {
    '#contact_form':  'submit:    addContact',
    '#name':          'value:     newContact.name',
    '#phone_number':  'value:     newContact.phone_number',
    '.name':          'text:      name',
    '.phone_number':  'text:      phone_number',
    '#add_contact':   'enable:    allowAdd()',
    '#contact_list':  'template:  {name: "contactTemplate", foreach: contacts}'
  },

  newContact: {name: ko.observable(""), phone_number: ko.observable("")},
  contacts: ko.observableArray(),
  addContact: function(){
    viewModel.contacts.push({name: viewModel.newContact.name(), phone_number: viewModel.newContact.phone_number()});
    viewModel.newContact.name("").phone_number("");
  },
  allowAdd: function(){
    return viewModel.newContact.name().length > 0 && viewModel.newContact.phone_number().length > 0;
  }
};

ko.applyBindings(viewModel);
