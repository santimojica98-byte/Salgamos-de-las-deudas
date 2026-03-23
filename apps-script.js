// ════════════════════════════════════════════════════════════
//  LIBERTAD FINANCIERA — Google Apps Script
//  
//  INSTRUCCIONES:
//  1. Abre tu Google Sheet: https://docs.google.com/spreadsheets/d/1a2Audm62CS-g4afC42gBXlqh7BprlTyMz1tcrSzG0uw
//  2. Extensions → Apps Script
//  3. Borra todo el código existente
//  4. Pega TODO este archivo
//  5. Guarda (Ctrl+S)
//  6. Deploy → New Deployment
//  7. Type: Web App
//  8. Execute as: Me
//  9. Who has access: Anyone
//  10. Click Deploy → Authorize → Copy the URL
//  11. Pega esa URL en el campo "Apps Script URL" de la app
// ════════════════════════════════════════════════════════════

// ── CORS headers para permitir requests desde la app
function setCorsHeaders(output) {
  return output
    .setMimeType(ContentService.MimeType.JSON);
}

// ── POST: Registrar pago desde la app
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // ── Hoja de Pagos
    var paymentsSheet = ss.getSheetByName('Pagos_App');
    if (!paymentsSheet) {
      paymentsSheet = ss.insertSheet('Pagos_App');
      var header = ['Fecha', 'Categoría', 'Deuda', 'Monto', 'Nota', 'Timestamp', 'ID'];
      paymentsSheet.appendRow(header);
      paymentsSheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#2dba7c').setFontColor('#ffffff');
      paymentsSheet.setFrozenRows(1);
    }
    
    // Generar ID único
    var paymentId = 'PAY_' + new Date().getTime();
    
    paymentsSheet.appendRow([
      data.date,
      data.catName || '',
      data.debtName || '',
      Number(data.amount) || 0,
      data.note || '',
      new Date().toLocaleString('es-CO'),
      paymentId
    ]);
    
    // ── Hoja de Resumen (actualizar saldo)
    updateSummarySheet(ss, data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        id: paymentId,
        message: 'Pago registrado correctamente' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: err.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── GET: Verificar conexión y obtener datos
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Si pide sync=true, devolver todos los pagos
    if (e && e.parameter && e.parameter.sync === 'true') {
      var payments = getPaymentsData(ss);
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true,
          status: 'ok',
          payments: payments,
          timestamp: new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true,
        status: 'ok', 
        message: 'Libertad Financiera API activa 💚',
        version: '2.0',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false,
        error: err.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Obtener todos los pagos
function getPaymentsData(ss) {
  var sheet = ss.getSheetByName('Pagos_App');
  if (!sheet) return [];
  
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  
  var data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  return data.map(function(row) {
    return {
      date: row[0],
      catName: row[1],
      debtName: row[2],
      amount: row[3],
      note: row[4],
      timestamp: row[5],
      id: row[6]
    };
  }).filter(function(p) { return p.amount > 0; });
}

// ── Actualizar hoja de resumen
function updateSummarySheet(ss, payment) {
  var summarySheet = ss.getSheetByName('Resumen_App');
  if (!summarySheet) {
    summarySheet = ss.insertSheet('Resumen_App');
    summarySheet.appendRow(['Última actualización', 'Total pagado', 'Número de pagos']);
    summarySheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#161b22').setFontColor('#ffffff');
  }
  
  // Get total paid
  var paymentsSheet = ss.getSheetByName('Pagos_App');
  var totalPaid = 0;
  var numPayments = 0;
  
  if (paymentsSheet && paymentsSheet.getLastRow() > 1) {
    var amounts = paymentsSheet.getRange(2, 4, paymentsSheet.getLastRow() - 1, 1).getValues();
    amounts.forEach(function(row) {
      totalPaid += Number(row[0]) || 0;
      numPayments++;
    });
  }
  
  // Update or add row
  if (summarySheet.getLastRow() <= 1) {
    summarySheet.appendRow([new Date().toLocaleString('es-CO'), totalPaid, numPayments]);
  } else {
    summarySheet.getRange(2, 1, 1, 3).setValues([
      [new Date().toLocaleString('es-CO'), totalPaid, numPayments]
    ]);
  }
}

// ── Función de prueba manual
function testConnection() {
  Logger.log('✅ Apps Script funcionando correctamente');
  Logger.log('Spreadsheet: ' + SpreadsheetApp.getActiveSpreadsheet().getName());
}
