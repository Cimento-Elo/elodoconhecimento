		let botao = document.getElementById('sortear');
        let participantes = document.getElementsByName('participante');
        let presentes = [];
		let text1;
		let text2;
		let element1;
		let element2;

		
        function pegaPresentes(){
            for (let i = 0; i < participantes.length; i++){
                if (participantes[i].checked) {
                    presentes.push(participantes[i].value)                    
                } 
            }
            
		    element1 = document.querySelector(".orador1").value=presentes[Math.floor(Math.random() * presentes.length)];
			//text1 = document.createTextNode(presentes[Math.floor(Math.random() * presentes.length)]);
			//element1.appendChild(text1);
            
			element2 = document.querySelector(".orador2").value=presentes[Math.floor(Math.random() * presentes.length)];			 
			//text2 = document.createTextNode(presentes[Math.floor(Math.random() * presentes.length)]);
			//element2.appendChild(text2);	
			
			if ((element2 == element1) || (element1 == element2))  {
				element1 = document.querySelector(".orador1").value=presentes[Math.floor(Math.random() * presentes.length)];
				element2 = document.querySelector(".orador2").value=presentes[Math.floor(Math.random() * presentes.length)];
				 
			}

        }   

		function changeStyle(){
			document.querySelector("#o01").style.backgroundColor = "rgb(254,185,48)",
			document.querySelector("#o02").style.backgroundColor = "rgb(254,185,48)"
		}
		
        botao.addEventListener('click', pegaPresentes);
        botao.addEventListener('click', changeStyle);
			
		
		
		
		
		
		
		
		