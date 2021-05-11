export function openWebSocket() {

    let ws;

    function init() {
      if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
      }

    //   ws = new WebSocket('ws://localhost:6969');
      ws = new WebSocket(location.origin.replace(/^http/, 'ws'));
      ws.onopen = () => {
        console.log('Connection opened!');
      }
    //   ws.onmessage = ({ data }) => showMessage(data);
    //   ws.onclose = function() {
    //     ws = null;
    //   }
    }

    
    init();
  }