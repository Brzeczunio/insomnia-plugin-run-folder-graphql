module.exports.requestGroupActions = [
  {
    label: 'Send All Requests',
    action: async (context, data) => {
      const { requests } = data;

      var count = 0;
      let results = [];
      results.push(`<tr>
                      <th>Request</th>
                      <th>Status Code</th>
					  <th>Content Code</th>
					  <th>Content</th>
                      <th>Time</th>
                      <th>Bytes</th>
                    </tr>`);
      for (const request of requests) {
        const response = await context.network.sendRequest(request);
		
		const fs = require('fs');
		var responseData = JSON.parse(fs.readFileSync(response.bodyPath, function (exists){}));
		
        var color = getStatusCodeColor(response.statusCode);
        var time = millisecToHumanReadable(response.elapsedTime);
		var colorTime = getTimeColor(time);
		
		if(responseData.errors)
		{
			results.push(`<tr>
							<td id="td_right">[${request.method}] </br> ${request.name}</td>
							<td id="td_right"><font color="${color}">${response.statusCode} ${response.statusMessage}</font></td>
							<td id="td_right"><font color="#D8696F">${responseData.errors[0].code}</td>
							<td id="td_right"><font color="#D8696F">${responseData.errors[0].message}</td>
							<td id="td_right"><font color="${colorTime}">${time}</td>
							<td id="td_right">${response.bytesRead}</td>
						  </tr>`);		
			count = count + 1;
		} else
        results.push(`<tr>
                        <td id="td_right">[${request.method}] </br> ${request.name}</td>
                        <td id="td_right"><font color="${color}">${response.statusCode} ${response.statusMessage}</font></td>
						<td id="td_right"></td>
						<td id="td_right"></td>
                        <td id="td_right"><font color="${colorTime}">${time}</td>
                        <td id="td_right">${response.bytesRead}</td>
                      </tr>`);
      }
	  
	results.push(`<div>Succeed: ${requests.length - count} of ${requests.length}</div>`);

      const css = `table { margin: 0 auto 0 auto; }
                   th, .label--small, label > small { text-align: center; padding: 10px 10px 10px 15px !important; padding-bottom: none !important; font-size: 15px !important; border: 1px solid #4B505C; }
                   td { border: 1px solid #4B505C; bgcolor="#ffffff"; }
                   #td_left { text-align: left; padding: 3px 40px 3px 10px; }
                   #td_right { text-align: center; padding: 3px 3px 3px 3px; }`
      const html = `<html><head><style>${css}</style></head><body><table bgcolor="#ffffff">${results.join('\n')}</table></body></html>`;

      context.app.showGenericModalDialog('Results', { html });
    },
  },
];

function getStatusCodeColor(statusCode) {
  if (statusCode.toString().startsWith("2")) {
    return "#8AB46C";
  } else if (statusCode.toString().startsWith("4")) {
    return "#D19A66";
  } else if (statusCode.toString().startsWith("5")) {
    return "#D8696F";
  }
}

function getTimeColor(time) {
  if (parseInt(time) > 10000) {
    return "#D8696F";
  } else if (parseInt(time) < 200) {
    return "#8AB46C";
  } else
	return "#D19A6";
}

function millisecToHumanReadable(millisec) {
  var seconds = (millisec / 1000).toFixed(2);

  if (millisec < 1000) {
    return millisec.toFixed(0) + " ms";
  } else if (seconds < 60) {
    return seconds + " s";
  }
}
