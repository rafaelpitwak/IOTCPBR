(function() {
	window.Main = {};
	Main.Page = (function() {
		var mosq = null;
		function Page() {
			var _this = this;
			mosq = new Mosquitto();

			$('#connect-button').click(function() { // recebe a ação do botão especificado com id="connect-button" e chama da função para conexão
				return _this.connect();
			});
			
			$('#disconnect-button').click(function() { // recebe a ação do botão especificado com id="disconnect-button" e chama da função para desconexão
				return _this.disconnect();
			});
			
			$('#liga-output').click(function() { // recebe os valores do id="liga-output"
				var payload = "L";   // cria uma variável com o valor "L"
				var TopicPublish = $('#pub-topic-text')[0].value; // recebe o valor do campo do tópico que está especificado como id="pub-topic-text", seria o tópico publicador
				mosq.publish(TopicPublish, payload, 0); // publica a mensagem no tópico especificado
			});
			
			$('#desliga-output').click(function() {
				var payload = "D";  
				var TopicPublish = $('#pub-topic-text')[0].value;				
				mosq.publish(TopicPublish, payload, 0);
			});

			mosq.onconnect = function(rc){ // chamada a função para conectar
				var p = document.createElement("p"); // cria um elemento tag <p>
				var topic = $('#pub-subscribe-text')[0].value; // recebe os valores do campo texto subscribe que contém o id="pub-subscribe-text"
				p.innerHTML = "Conectado ao Broker!"; // insere a mensagem desejada na tag desejada HTML
				$("#debug").append(p); // apresenta a mensagem onde tem o id="debug"
				mosq.subscribe(topic, 0); // assina a mensagem do tópico que está no id="pub-subscribe-text"
				
			};
			
			mosq.ondisconnect = function(rc){ // quando a função para desconectar for executada, essa função será executada para analisar o status da conexão
				var p = document.createElement("p"); // cria um elemento tag <p>
				var url = "ws://iot.eclipse.org/ws"; // pega a URL do servidor MQTT público
				
				p.innerHTML = "A conexão com o broker foi perdida"; // insere a mensagem desejada na tag desejada HTML
				$("#debug").append(p); // apresenta a mensagem onde tem o id="debug"					 
			};
			
			mosq.onmessage = function(topic, payload, qos){ // chamada função que recebe mensagens do servidor
				var p = document.createElement("p"); // cria um elemento tag <p>
				var acao = payload[0]; // cria a variável que receberá o valor
				
				//escreve o estado do output conforme informação recebida
				if (acao == 'L')
					p.innerHTML = "<center><img src='ligado.png'></center>"
				else
					p.innerHTML = "<center><img src='desligado.png'></center>"
				
				$("#status_io").html(p); // mostra no id="status_io" a mensagem recebida
			};
		}
		
		Page.prototype.connect = function(){ // função padrão para conectar no servidor MQTT
			var url = "ws://iot.eclipse.org/ws";
			mosq.connect(url);
		};
		
		Page.prototype.disconnect = function(){ // função padrão para desconectar no servidor MQTT
			mosq.disconnect();
		};
		
		return Page;
	})();
	$(function(){
		return Main.controller = new Main.Page;
	});
}).call(this);

