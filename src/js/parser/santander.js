var ofxParser = require('./ofx');
var _  = require('lodash');
var moment = require('moment');

module.exports = {
  ofx: function(expenses) {
    debugger
    return ofxParser.serialize(
      this.headers()
      , {
        SIGNONMSGSRQV1: this.bankInfo(),
        BANKMSGSRSV1: this.reportDetail(expenses)
    });
  },

  headers: function(){
    return {
      OFXHEADER: '100',
      DATA: 'OFXSGML',
      VERSION: '103',
      SECURITY: 'NONE',
      ENCODING: 'USASCII',
      CHARSET: '1252',
      COMPRESSION: 'NONE',
      OLDFILEUID: 'NONE',
      NEWFILEUID: 'unique id here'
    };
  },

  bankInfo: function() {
    return {
      SONRS: {
        STATUS: {
          CODE: 0,
          SERVERITY: 'INFO'
        },
        DTSERVER: '20170109195336[-3:GMT]',
        LANGUAGE: 'ENG',
        FI: {
          ORG: 'org',
          FID: 'fid'
        }
      }
    };
  },

  reportDetail: function(expenses){
    return {
      STMTTRNRS: {
        TRNUID: 1,
        STMTRS: {
          CURDEF: 'BRL',
          BANKACCTFROM:{
            BANKID:'033',
            ACCTID:'430601086575',
            ACCTTYPE: 'CHECKIN'
          },
          BANKTRANLIST: {
            DTSTART:this.minDate(expenses).format('YYYYMMDDHHmmSS') + '[-3:GMT]',
            DTEND:this.maxDate(expenses).format('YYYYMMDDHHmmSS') + '[-3:GMT]',
            STMTTRN: this.expensesMap(expenses)
          }
        }
      }
    }
  },

  minDate: function(expenses) {
    return _.chain(expenses)
      .map(function(expense){
        return moment(expense.date, "DD/MM/YYYY");
      })
      .min()
      .value();
  },

  maxDate: function(expenses) {
    return _.chain(expenses)
    .map(function(expense){
      return moment(expense.date, "DD/MM/YYYY");
    })
    .max()
    .value();
  },

  mapDates: function(expenses) {
    return _.chain(expenses)
    .map(function(expense){
      return moment(expense.date, "DD/MM/YYYY");
    })
    .value();
  },

  expensesMap: function(expenses){
    return _.map(expenses, function(expense, index){
      return {
        TRNTYPE: 'OTHER',
        DTPOSTED: moment(expense.date, "DD/MM/YYYY").format('YYYYMMDDHHmmSS') + '[-3:GMT]',
        TRNAMT:'-' +  expense.real,
        FITID:'00350372',
        CHECKNUM:'00350372',
        PAYEEID:'0',
        MEMO: expense.desc
      };
    });
  }
}
