export const REGEX = {
    RFC: '^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([A-Z]|[0-9]){2}([A]|[0-9]){1})?$',
    CURP: '^([A-Z&]|[a-z&]{1})([AEIOU]|[aeiou]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([0-9]{2})$',
    CP:'^([0-9]{5})$',
    TELEFONO:'^([0-9]{10})$',
    CORREO: '^[_a-z0-9-]+(.[_a-z0-9-]+)@[a-z0-9-]+(.[a-z0-9-]+)(.[a-z]{2,4})$',
    LISTANOCERO: '[1-9]{1}([0-9]{1,5})?',
    LISTACONCERO: '[0-9]{1}([0-9]{1,5})?',
    CADENA:'[a-z0-9\.\-\s]+$',
    CIEN:'^(100|[1-9]|[1-9][0-9])$',
    SOLONUMEROS:'[0-9]+',
    DECIMALES:'[0-9]+(\.[0-9][0-9]?)?',
    DECIMALESNEG:'^-?[0-9]+(\.[0-9][0-9]?)?'

}