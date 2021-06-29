const Ajv = require('ajv');
const AjvErrors = require('ajv-errors');

module.exports = function (f) {
  const ajv = new Ajv({
    allErrors: true,
    useDefaults: true,
    coerceTypes: true,
    $data: true
  });

  ajv.addKeyword({
    keyword: 'isFileType',
    compile: (schema, parent, it) => {
      parent.type = 'file';
      delete parent.isFileType;
      return () => true;
    }
  });

  AjvErrors(ajv);
  
  f.setValidatorCompiler(({ schema, method, url, httpPart }) => {
    return ajv.compile(schema);
  });
};