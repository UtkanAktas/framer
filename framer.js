/*!
Framer project strickly depends on following javascript plugins which they are not part of the framer.js.
And framer licance doesn't cover those projects
	dotter.js => webfikri.com/dotter
	typeThis.js => webfikri.com/typeThis
	addStem.js => webfikri.com/addstem
	
those javascript projects must be added into the webpage before framer.js 

MIT License

framer project - http://webfikri.com/calismalar/framer

Copyright (c) 2017 Utkan AKTAŞ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

;(function($){
var touchScr = 0,
	max_index = 100;//index bul fonksiyonunun bulduğu son index

if ('ontouchstart' in document.documentElement) {   
		touchScr = 1;
}	
function index_bul(){
	$(".iBul").each(function() {

		var index_current = parseInt($(this).css("zIndex"), 10);
		if(index_current>max_index){
			max_index = index_current;
		}
	});

	return max_index+1;
}	
//Browser Support
//check console is aveilable
window.console = typeof window.console === "undefined"?
window.console = {log:function(){}}:
window.console;

if (!Date.now) {
	Date.now = function() { return new Date().getTime(); };
}

//common functions
function isInt(value) {
  var x;
  if (isNaN(value)) {
	return false;
  }
  x = parseFloat(value);
  return (x | 0) === x;
};










/******FRAMER UI*********/
window.frameUi = new function(){
var that = this;
this.def = {
	headC :"#333333",//menuleri acan elementlerin default color değeri
	headBg : "#FCFCEF",//default background-color değeri
	headHovC:"#FFFFFF",//menuleri açan elementlere hover olunduğunda aldıkları color değeri
	headHovBg:"#39AA27"//hover olduğunda aldığı background-color değeri
};

this.fx = function(){//ortak efectler fade-in fade out gibi
	var fadeTime = 300;
	function fadeIn(elem,callBack){
		var $elem = $(elem);
		callBack = callBack||function(){};
		$elem.css("display","block");
		$elem.stop().animate({
			opacity:1
		},fadeTime,callBack);
		
	}
	
	function fadeOut(elem,callBack){
		var $elem = $(elem);
		callBack = callBack||function(){};
		$elem.stop().animate({
			opacity:0
		},fadeTime,function(){
			$elem.css("display","none");
			callBack();
		});
	}
	
	return {
		fadeIn:fadeIn,
		fadeOut:fadeOut
	};
}();

this.menu = function(){//aside.frame div.menu ve div.menu_list
	
	var status = "close",//menu penceresinin açık veya kapalı hangi konumda bulunduğu açılma ve kapanma efect süresi boyunca bu değişken false olarak atanır efect tamamlandığında that.fx ilgili fonksiyonuna pass edilen callback fonksiyonu aracılığı ile bu değişken tekrar "open" veya "close" olarak set edilir
		menuHead = null,//menuyu açılması için kullanıcının tıkladığı html elementi
		menuList = null;//açılan menunun en dış konteyneri ile birlikte tüm element



			/*VİEW FUNCTİONS*/
	//sayfa yüklendiğinde menu HTML elementlerini ve bazı default css değerlerini değişkenlere alır.
	// bu elementlere ulaşılmak istendiğinde her zaman bu değişkenler kullanılmalıdır.
	
	menuHead = menuHead || $("aside.frame div.menu");
	menuList = menuList || $("aside.frame div.menu_list");
	
	//menuHeadBg = menuHead.css("background-color");
	//menuHeadC = menuList.css("color");


	function setStatusOpen(){//efect süresi bittiğinde status değişkenini "open" olarak set edicek olan fonksiyon
		status = "open";
	}
	
	function setStatusClose(){//kapanma efecti bittiğinde status değişkenini "close" olarak set edicek olan fonksiyon
		status = "close";
	}
	
	
	// menu HTML elementinin açılıp kullanıcıya gösterilmesini sağlar
	function menuAc(){
		//var headBg = "",
		//	headC = "";
		//if(!status|| status==="open"){return false;}//menu açık durumdaysa veya efect uygulanmakta ise işlem yapılmaz
		
		//UI üzerindeki  menu'yu açan ikona hover ve mover durumlarında css tarafında farklı renkler atanmaktadır.
		//kullanıcı menuyu açık hale getirdiğinde mouse'u bu ikonun üzerinden çekse bile bu renklerin hover konumunda
		//kalmasını istediğimden. menu açık ve kapalı konumlarda bu ikonun css kodlarını yeniden oluşturuyorum.  
		//headBg = menuHead.css("background-color");
		//headC = menuHead.css("color");
		
		status = false;//efect süresi boyunca tekrar açılma veya kapanma komutu almasını engeller
		that.fx.fadeIn(menuList,setStatusOpen);//menu_list gösterime alınma işlemi ve status değişkenini set edicek callback fonksiyonu
		menuHead.css({
			"background-color":that.def.headHovBg,
			"color":that.def.headHovC
		});
		menuList.css("z-index",index_bul());
		
		
	} 
	
	function menuKapa(){//açıklamalar için menuAc() fonksiyonu
		//if(!status|| status==="close"){return false;}
		status = false;
		that.fx.fadeOut(menuList,setStatusClose);
		//menu kapalı konuma geçtiğinde default renk değerlerini tekrar atayarak kontrolü css'e bırakıyoruz.
		menuHead.css({
			"background-color":"",
			"color":""
		});
		
	}
	
	
									/*CONTROL BİLEŞENLERİ*/
	menuHead.on("click",function(){
		if(status===false){return false;}//geçiş efecti sırasında veya liste açıkken tıklama çalışmaz
		if(status==="open"){
			menuKapa();
		}else{
			menuAc();
		}
		
	});
	
	$("html").on("click",function(e){
		var $el = $(e.target);
		if(!status || status==="close" ){}else{
			if($el.closest(menuList).length === 0){
				if(status === "open"){
					menuKapa();
				}
			}
		}
		
		
	});
	
	
	/*TEST FUNCTİONS*/
	function getStatus(){
		return status;
	}
	
	return {
		ac:menuAc,
		kapa:menuKapa,
		
		//testFunctions
		getStatus:getStatus,
	}; 
		
}();//menu

this.frames = function(){//sol tarafda bulunan frame selector menusu
	var control = null,//hover olunduğunda list elementini açan kontrol bileşenlerini tutan HTML elementi
		list = null,//açılır liste HTML elementi
		status = "close",//list elementinin geçerli durumunu tutan değişken. açılma ve kapanma efecti çalışırken bu değişken false değeri alır.

		mOverC = false,//mouse eğer control elementinin üzerinde bulunuyorsa budeğer true çıktığında false
		mOverL = false;//list elementi için aynı durum
		
	control = control || $("aside.frame div.control");
	list = list || $("aside.frame div.frameSlc");
	
	
	function getStatus(){
		return status;
	}
	
	function setStatusOpen(){
		status = "open";
	}
	function setStatusClose(){
		status = "close";
	}
	
	function openList(){
		status = false;
		control.css({
			"color":that.def.headHovC,
			"background-color":that.def.headHovBg,
		});
		list.css({"z-index":index_bul()});
		that.fx.fadeIn(list,setStatusOpen);
	}
	
	function closeList(){
		status = false;
		control.css({
			color:"",
			"background-color":""
		});
		that.fx.fadeOut(list,setStatusClose);
	}
	
					/*CONTROL*/
	control.on("mouseenter",function(){
		mOverC = true;
		if(!status||status ==="open"){return false;}
		//menu açık ise kapatır;
		if(that.menu.getStatus()==="open"){that.menu.kapa();}	
			
		openList();
		
	}).on("mouseleave",function(){
		mOverC = false;
		if(!status||status ==="close"){return false;}
		setTimeout(function(){
			if(!mOverC && !mOverL){
				closeList();
			}
		},40);
		
		
	});
	
	list.on("mouseenter",function(){
		mOverL = true;

	}).on("mouseleave",function(){
		mOverL = false;
		if(!status||status ==="close"){return false;}
		setTimeout(function(){
			if(!mOverC && !mOverL){
				closeList();
			}
		},40);
	});
	
	return{
		ac:openList,
		kapa:closeList,
		status:getStatus
	};
	
}();//frames

this.builder = function(){
	var framer = null,//tüm HTML inputlar
		
		partId = 0,//yüklü olan partın id nosu... class=p0, p1, p2 vs 
		part = null,//yüklü olan partın HTML elementi loadPart() fonksiyonu tarafından atanır
		h2 = [],//arayüzdeki part seçicilerii oluşturmak amacı ile her bir part içindeki h2 tagları bu arrayda toplanır
		h3 = [],//Kullanımda olan geçerli part'ın her bir frame'ine ait h3 başlığı
		ui = null,//kullanıcı arayüzü bileşenleri aside.frame
		
		control=null,//arayüzde frame kontrolünü sağlayan element
		ctrList=null;//frame control elementinin altındaki açılır liste
	
	
	framer = framer||$("section.framer");
	ui = ui||$("aside.frame");
	control = control || ui.find("div.control");
	ctrList = ctrList || ui.find("div.frameSlc");
	
	
	
	
	
	function getSectionsName(){
		//arayüzde hangi part seçimi yapabilmek için her bir parta ait başlıklar bir array da toplanır.
		var h = "";
		h2 = [];
		framer.find(".part").each(function(){
			h = $(this).find("h2:first");
			h = h.length>0?h.text():"...";
			h2.push(h);
		});
	}
	
	function createSections(){
		//h2 içerisinde biriktilen her bir part adı için kullanıcı arayüzünde seçilebilir bir buton oluşturulur
		var len = h2.length,
			i = 0,
			ul = null,
			str = "";
			
		ul = ui.find("ul.sections");
		ul.html("");
		for(i=0;i<len;i++){ 
			str = '<li class="common '+(i===0?"selected":"")+'" data-id="'+i+'">'+h2[i]+'</li>';
			ul.append(str); 
		}
	}
	
	function loadPart(info){
		//info = yüklenen parta ait framer coredan gelen bilgileri barındıran object
			/*{
				title = ["başlık1","başlık2","başlık3"],
				curPart,
				curFrame,
				paused
			}*/

		var id = info.curPart,
			selector = ".part"+".p"+id,
			curPart = info.curPart,
			curFrame = info.curFrame,
			frameCount = info.frameCount,
			paused = info.ended?"replay":info.paused;
		partId = id;	
		h3 = info.title;	
		part = framer.find(selector);
		createFrameList(curFrame);
		assignFrameControl(paused,curFrame,frameCount);
		changeFrameLi(curFrame);
		changeLayer(curPart);
		
	}
	
	
	function createFrameList(curFrame){
		var len = 0,
			i = 0,
			ul = null,
			str = "";
			
		len = h3.length;
		ul = ctrList.find("ul.frameList");
		ul.html("");
		for(i=0;i<len;i++){
			str = '<li class="sec '+(i===curFrame?"slctd":"")+'" data-id="'+i+'" data-tur="jump">'+h3[i]+'</li>';
			ul.append(str);
		}
			
	}
	function assignFrameControl(paused,curFrame,frameCount){
		var play = paused?(paused==="replay"?"fa-repeat":"fa-play"):"fa-pause",
			status = paused?"paused":"playing",
			prev = (curFrame-1)<0?false:curFrame-1,
			next = (curFrame+1)===frameCount?false:curFrame+1,
			noPrev = prev===false?"noJump":"",
			noNext = next===false?"noJump":"",
			playTur = paused==="replay"?"replay":"play",
			$el = $("aside.frame .control");

		$el.find(".play").removeClass("fa-pause fa-play fa-repeat noJump").addClass(play).data("status",status)
		.data("tur",playTur);
		$el.find(".prev").data("id",prev).removeClass("noJump").addClass(noPrev);
		$el.find(".next").data("id",next).removeClass("noJump").addClass(noNext);
		$el.find(".sayac").text(curFrame+1);
		
	}//frame kontrol butonlarının değerlerini atar.
	function changeFrameLi(id,end){
		//id = "selected" olarak sınıf atanacak olan li'nin id'si
		//end = true || false (varsayılan ->"false") tüm partın bittiğini belirten argüman
		end = end || false;// varsayılan olarak false atanır.
		var id = id,
			$el = $("aside.frame .frameSlc li");
		
		if(!$el.length){
			return false;
		}
		$el.each(function(index,el){
			$(el).removeClass("slctd");
			if(index===id && !end){
				$(el).addClass("slctd");
			}
		})
	}//frame seçimi yapılan açılır penceredeki li lerin selected işlemini kontrol eder
	function changeSelectedSection(elem){
		//elem = yeni selected olacak li elementi $(li)
		$("ul.sections li.selected").removeClass("selected");
		elem.addClass("selected");
	}
	function changeLayer(id){
		//yeni gelen partın id'si
		//HTML ilk yüklendiğinde hiçbir partın üzerinde "selected" sınıfı bulunmamaktadır.
		//ilk yüklenişte geçiş efekti çalıştırılmaz.
		var nextPart = $(".framer > .p"+id);
		var curPart = $(".framer > .selected");//gösterimden kaldırılacak olan layer
		
		 
		
		//herhangibi selected part bulunamadıysa efect uyuglanmadan istenilen part gösterime alınır.
		if(!curPart.length){
			nextPart.addClass("selected").css("display","block");
			return true;
		}
		
		//curPart gösterimden kaldırılr
		that.fx.fadeOut(curPart);
		curPart.removeClass("selected");
		nextPart.addClass("selected");
		setTimeout(function(){
			that.fx.fadeIn(nextPart);
		},50);
		
		return true;
		
				 
	}//part değiştiğinde ona ait layer'ı(div.p0.part) değiştiren fonksiyon
	
	
	
	return {
		loadPart:loadPart,
		changeSelectedSection : changeSelectedSection,
		getSectionsName : getSectionsName,
		createSections : createSections,
		assignFrameControl : assignFrameControl,
		changeFrameLi : changeFrameLi

	};
}();//builder


}();//window.frameUi


/**********FRAMER CORE *************/ 

(function(){
	//CLOSURE VARS her oluşturulan framer nesnesi için aşağıdaki değişkenler ortak kullanılır.
	var list = {
			/*0:{ // herbir frame grubu (part)
				0:[fn0,opt={"title":"başlık"}],//part içindeki her bir fonksiyon için bir obje
				1:fn1,
				2:fn2,
				length:3
			}
			  1:{
				0:fn0,
				1:fn1,
				2:fn2,
				length:3
			}
				length:2*/
		
		},//Sunuma ait tüm part,frame ve fonksiyonlar bu obje içerisinde saklanır 
		undo = {/*
			0:{//her bir frame için bir object
				0:{//bir frame içindeki her bir işlem için bir object ->key = curFunc
					type:"css","animate"....,
					func:callBack
				},
				1:{},
				2:{},
				length:3//ilgili frame içinde kaç işlem olduğu
			},
			1:{},
			length:2//kaç frame olduğu*/
		},//undo işlemleri bu array/object içerisinde "p0" "fr0" key değerleri ile birlikte toplanır
		//undo listesine sadece çalıştırılmış bir fonksiyon kayıt edilir. "run" veya "instant" modunda.
		save = {
			/*bir part ikinci kere save edildiğinde eski verinin üzerine yazılır
			0:{
				curPart:curPart,
				curFrame:curFrame,
				curFunc:curFunc,
				nextFunc:nextFunc,
				paused:paused,
				undo:undo,
				timeOuts,timeOuts
			},
			1:{},//her bir part için bir obje eklenir.			
			*/
		},//sunumu yapılmakta olan partın o anki durumunu save eder.
		live = {
			/*
			0:{ her bir frame grubu part
				0:{ her bir frame
					id:{ her işlem için kendi id si ile bir object }
				}
			}
			*/	
		},//live nesnesi animasyon gibi belirlibir zaman aralağı boyunca çalışan işlemelri tutar. Her bir işlem
		// ilk çalıştırıldığı anda
		// kendi partı > kendi framei > id no su ile bu değişken içerisine aktarılır.
		
		//fonksiyon kendi alt metodları bulunan bir objedir.
		/*id:{
			_constants:{ bu objeye ait veriler },
			resume:function(){}
			pause:function(){}
			destroy:function(){}	
		}*/
		//fonksiyon kendi çalışma süresini doldurduğunda bu değişken içerisinden kendisini kaldırır. ( destroy() )
		//fonksiyonun undo modu çalıştığında bu değişken içerisinden kendisni kaldırır. ( destroy() )
		//fonksiyon instant modunda çalıştığında bu değişken içerisinden kendisini kaldırır. ( destroy() )
		//fonksiyon bu değişken içerisinde durduğu sürece framer.pause() ve framer.resume() fonksiyonları tarafından kontrol edilr.
		
		//framer.pause() ile geçerli partın geçerli frami içindeki tüm id'ler ( live fonksiyonarlın ) pause() metodu çalıştırılır
		//framer.resume() ile geçerli partın geçerli framei içindeki tüm id'lerin resume() metodu çalıştırırılr.
		
		curPart = 0,//Şuan kullanımda olan partın index numarası list[0], list[1].....
		curFrame = 0,//şuan kullanımda olan framin index numarası list[curPart][0]........
		curFunc = 0,//En son çalıştırılan fonksiyonun id'si.
					//bir frame içerisindeki fonksiyonlar this.css(), this.animate() gibi çalıştırıldıklarında onlara bir id vermek amacı ile bu değişken kullanılır. bir fonksiyon "instant" veya "run" modunda çalıştığında kendi undo() fonksiyonu oluşturur. oluşturulan undo() fonksiyonu buradaki id ile undo{} array/object listesine kayıt edilir
					//"run" veye "instant" modunda bir fonksiyon çalıştırıldığında curFunc değerini 1 arttırır
					//böylece bir sonraki fonksiyonun id no su tespit edilmiş olur.
					//curFunc++ işlemi this.addUndo() fonksiyonu içerisinde gerçekleştirilir. Çünkü bir fonksiyon ister "run" ister "instant" modunda çalışsın mutlaka son işlem olarak addUndo() fonksiyonunu çağırmaktadır.
		nextFunc = 0,//sunum instant modunda çalıştırıldığında en son hangi fonksiyonda kalındığının tespiti için 
		//nextFunc değişkeni this.stat() fonksiyonunda 0 değerini alır.
		//nextFunc değişkeni this.pause() fonksiyonunda this.curFunc değişkeninin değerini alır.
		mode = "run",// fonksiyonların hangi modda çalışacağını belirleyen değişken
		
			//"instant" fonksiyona kendisini timeOuts içine yüklemeden yapması gereken işin derhal yapılmasını belirtir
			//"run" frame'in gösterimde olduğunu belirtir, fonksiyonlar "timeOuts" içerisine kendilerini yüklerler
			//***ÖNEMLİ : her iki modda da fonksiyon "undo" fonksiyonunu tanımlar.
		paused = false,//sunumun pause durumunda olup olmadığı.
		ended = false,//bir partın sonunda çalıştırılan end() fonksiyonu b udeğişkeni true yapar. framerCtrl sınıfına bu partın en sonuna ulaşıldığının bilgisini aktarmak için kullanırılr.
		margin = 0,// "run" modunda framer.start() veya framer.resume() fonksiyonları aynı anda hem timer'i 0 dan başlatırlar hemde geçerli frame ait tüm fonksiyonları timeOuts[] arrayında yeniden düzenlerler. timeOuts arrayının yeniden düzenlenmesi bir çok cihazda 1-2 milisaniyeden fazla sürmeyecektir ancak bu bir kaç milisaniyelik fark timer değeri ile timeOuts[] içinde biriktirilen fonksiyonların timeOut değerleri arasında negatif bir boşluk doğuracaktır. Bug oluşmasını önlemek amacı ile makul bir margin değeri (kullanıcının hissetmeyeceği kadar) tüm stop, pause, resume, start işlemlerinde timer değerinden çıkartılmalıdır.
		//**** ÖNEMLİ: margin geçici bir çözüm olarak eklendi, tarayıcının kasılması, donması gibi durumlarda bu bug ortaya çıkacaktır. Bu tip durumlar için bir metod geliştirilmeli!!!!
			//fikir 1: timeOuts[] arrayının yüklenmesinin kaç mili saniye sürdüğü başlangıçta ve bitişte alınan timestamplar ile hesaplanıp timer değerinden çıkartılır.
			//fikir 2: timeOuts[] arrayına her müdahale edilişinde bu işlem için geçen süre timer değerinden çıkartılır. (daha mantıklı)
			//çözüm : timeOuts değişkenine set edilmesi işlemini başlatan this.start(), this.resume() gibi fonksiyonların en başında "margin" değişkenine time stamp atanır. Bu fonksiyonlar ard arda çalışacak pek çok this.addTimeOuts() fonksiyonunu barındırmaktadır. her bir addTimeOuts() fonksiyonu this.start() çalışmaya başlamasıyla kendi işlemnini gerçekleştirmesi arasında geçen süreyi "curMargin" değişkenine atar. bir sonraki addTimeOuts() fonksiyonu "curMargin" değerini kendi ekleyeceği fonksiyonun timeOut değerine ekler ve kendi işlemi için geçen süreyi tekrar "curMargin" değişkenine set ederek kendien sonra gelecek olan addTimeOUts() fonksiyonunun kullanımına bırakır.
		curMargin = 0,
		timer = 0,//her bir frame başlangıcında sıfırlanır. daha sonra her pause start işleminde tekrar resetlenir.
		
		//timeOuts arrayında fonksiyonların ne kadar süre sonra çalıştırılacağı listelenmiştir. pause yapıldığında
		//timer değişkeninden ne kadar süre geçtiği öğrenilir ve timeOuts arrayındaki her bir fonksiyonun zamanlaması
		//yeniden hesaplanır.
		timeOuts = [
			/*{
				timeOut:200,//false değeri var ise bu fonksiyonun daha önceden çalıştığını gösterir.
				type:"css, animate, ....."
				func:callBack,
				init: setTimeout(function(){callBack()},200),
				
			}*/
		],
		framer = function(selector){
			return new init(selector);
			
		},
		init = function (selector){
			this[0] = $(selector);
			return this;
		};
	
	
	//framer ile framer() bir birinden farklı objelerdir. Sadece aynı ismi kullanırlar.
	//framer objesi kontrol metodlarını barındırır.
	//framer() çağırıldığında init objesi döner bu obje elementler üzerinde işlem yapan methodları barındırır. 
	
	//framer. metodları
	framer.addFrame = function(keys,opt,callBack){
		
		var p =false,
			fr = false,
			flag = true,
			title = "",
			i = 0;
			
		//check keys
		flag = typeof keys[0] !=="string" || typeof keys[1] !== "string"?false:true ;
		if(flag){
			p = /^(p\d+)$/.test(keys[0])?parseInt(keys[0].split(/p/)[1],10):false;
			fr = /^(fr\d+)$/.test(keys[1])?parseInt(keys[1].split(/fr/)[1],10):false;
			
		}
		
		if(!flag || p===false || fr===false){
			console.log('framer.addFrame() fonksiyonunda gönderilen keys argümanı sorunlu! keys = {"p0", "fr0"} şeklinde olmalı');
			return false;
		}
		
		//check Opts
		if(typeof callBack === "undefined" && typeof opt === "function"){
			callBack = opt;
			opt = {};
		}else if(typeof opt !== "object"){
			console.log('framer.addFrame() fonksiyonun argümanları sorunlu (keys = ["p0","fr0"], opt={}, callBack()) şeklinde olmalı');
			return false;
		}
		
		
		//check callBack()
		if(typeof callBack !== "function"){
			console.log('framer.addFrame() fonksiyonun callBack() argümanı doğru girilmemiş function(){} olarak gönderilmeli');
			return false;
		}
		
		//check title
		opt.title = opt.title || "frame "+(fr+1);
		
		//add list
		list[p] = list[p]||{length:0};
		
		//eğer aynı id ile(fr) daha önce bir object oluşturulduysa list[p].length değeri arttırılmaz
		//eğer daha önce bu obje yokise length değeri 1 arttırılır.
		//tabi bu şekilde eski frame verisinin üstüne yenisi yazılmış olacaktır. 
		i = list[p][fr]?0:1;
		list[p].length += i;
		list[p][fr] = [callBack,opt];
		
		return this;
		
	}//her bir part ve frame için yazılan fonksiyonları list nesnesine ekler
	
	framer.start = function(index){
		//index = list değişkeni içinde yüklü olan ve kullanımda olan parta ait fonksiyonların index numarası
		//geçerli olan partın index numarası curPart değişkeninden alınır
		
		//ilgili frame'e ait tüm fonksiyonlar "run" modunda çalıştırılır
	
		mode = "run";
		curFrame = index;
		curFunc = 0;
		nextFunc = 0;
		paused = false;
		ended = false;
		startClock();//timer başlatılır
		startMargin();//margin sayacı başlatılır
		if(!list[curPart][curFrame]){
			console.log('framer.start('+index+') fonskiyonuna girilen index numarasıyla bir frame bulunamadı');
			return false;
		}
		list[curPart][curFrame][0]();
		return true;
		
	};//Bir framein başlangıç işlemlerini yapar, sayfa ilk yüklendiğinde veya yeni bir part yüklendiğinde otomatik olarak başlatırılr
	framer.pause = function(){
		var curTime = 0,//başlangıç ile pause arasında geçen süre 
			loopStart = 0,//for döngüsünün başladığı anki time stamp
			timeOut = 0,//her bir loopda ilgili fonksiyonun yeniden hesaplamış time out değeri
			k,//for in loop
			i = 0;
			
		//sunumun halihazırda pause konumunda olup olmadığı kontrol edilr.	
		if(paused)	{return false;}	
		
		paused = true;
		nextFunc = curFunc;
		curTime = stopClock();
		loopStart = Date.now();
		
		//trigger pause on live object
		if(live[curPart] && live[curPart][curFrame]){
			//for loop for each curFrame paroperty on live object
			for (k in live[curPart][curFrame]){
				if(live[curPart][curFrame].hasOwnProperty(k)){
					//trigger pause() fonktion of each live object
					live[curPart][curFrame][k].pause();
				}
			}
		}
		
		//timeOuts arrayında bekleyen tüm işlemler için bir döngü oluşturulur ve
		//her döngüde setTimeout() u barındıran .init() metodu clear edilir.
		//fonksiyonun yeni timeOut değeri yeniden hesaplanarak override edilir.
		for( ; i<timeOuts.length; i++){
			timeOut = timeOuts[i].timeOut;
			//timeOut değeri false ise bu fonksiyonun daha önceden çalıştırıldığını gösterir.
			if(timeOut===false){continue;}
			
			timeOut = timeOut - curTime;
			clearTimeout(timeOuts[i].init);
			timeOut += (loopStart - Date.now());
			timeOuts[i].timeOut = timeOut<0?0:timeOut;	
		}
		
		return true;
		
	};//çalışmakta olan frame'in duraklatılmasını sağlayan fonksiyon
	framer.resume = function(){
		//resume fonksiyonu basitçe timeOuts arrayı içinde çalışması durdurulmuş tüm fonksiyonları alır.
		//timeOuts arrayını sıfırlar
		//herbir fonksiyonun(objenin) timeOut değeriyle obje.func metodunu setTimeout olarak ayarlar ve 
		//timeOuts arrayını yeniden oluşturur.
		
		var _array = [],//timeOuts[] arrayının içeriği bu değişkende saklanır.
			timeOut = 0,//her bir obje/fonksiyon.timeOut propertysi (loop içinde kullanılır)
			func = null,//her bir obje/fonksiyon.func property'si (loop içinde)
			type = "",//her bir obje/fonskiyon.type property'si (loop içinde)
			k,
			i = 0;
		
		if(!paused){return false;}
		
		//trigger resume on live object
		if(live[curPart] && live[curPart][curFrame]){
			//for loop for each curFrame paroperty on live object
			for (k in live[curPart][curFrame]){
				if(live[curPart][curFrame].hasOwnProperty(k)){
					//trigger pause() fonktion of each live object
					live[curPart][curFrame][k].resume();
				}
			}
		}
		
		
		
		_array = timeOuts;
		timeOuts = [];//timeOuts arrayı tamamen boşaltılır
		startClock();
		startMargin();//addTimeOut fonksiyonu margin değerini hesaplayıp her fonksiyonu ekleyecektir.
		for( ; i<_array.length; i++){
			timeOut = _array[i].timeOut;
			//timeOut=false ise bu fonksiyon daha önce çalıştırılmıştır ve arraydan Çıkartılır
			if(timeOut===false){ continue;}
			func = _array[i].func;
			type = _array[i].type;
			addTimeOut(func,timeOut,type);
		}
		paused = false;
		return true;
		
	};//geçerli frame'in kaldığı yerden devam etmesini sağlayan fonksiyon	
	framer.jump = function(id){
		//atlanacak olan frame'in id no'su.
		//pause konumunda olup olmadığı kontrol edilir eğer pause durumunda değil ise pause edilir
		//atlanacak frame geçerli frameden ilerde mi geride mi ona bakılır. 
		//ileride ise instant modu geride ise undo fonksiyonları kullanılır.
		//her iki durumda da timeOuts[] arrayı içindeki fonksiyonlara ihtiyaç kalmadığından bu array sıfırlanır.
		//Geride ise :
			// örneğin 4 no'lu frame şuan çalışmakta ve biz 2 nolu frame'e geçmek istiyoruz.
			//timeOuts[] arrayı sadece 4 no'lu frame'e ait fonksiyonları bulundurduğundan bu array sıfırlanır.
			//undo{} objesi içindeki undo[4] objesinde biriktilen tüm metodlar çalıştırılr doUndo(4);
			//undo{} objesi içindeki undo[3] objesinde biriktilen tüm metodlar çalıştırılr doUndo(3);
			//undo{} objesi içindeki undo[2] objesinde biriktilen tüm metodlar çalıştırılr doUndo(2);
			//undo.2 'yi çalıştırmamısın sebebi 2 no'lu frame'in baştan başlatılacak olması
			//2 no'lu frame run modunda çalıştırılr
		//ileride ise : 
			//örneğin 4 no'lu frame çalışırken biz 6 no'Lu frame'ye geçmek istiyoruz.
			//timeOuts[] arrayı sadece 4 no'lu frame'e ait fonksiyonları bulundurduğundan bu array sıfırlanır.
			//4 no'lu frame instant modunda çalıştırılr. nextFunc global değişkeni 4 no'Luframde en son hangi işlemde
				//kalındığını tuttuğu için 4 no'Lu framede o ana kadar çalıştırılan fonksiyonlar atlanıp geri kalanlar
				//instant modunda çalıştırılacaktır.
			//5 no'lu frame instant modunda çalıştırılır.
			//6 no'lu frame run modunda çalıştırılır.
		var keys = [],//geçiş yaparken kullanılacak framelerin id değerleri
			metod = "",
			say = 0,//döngüdeki ilk işlemi belirlemek için
			i = curFrame;//kullanılacak metod "undo" veya "instant"
		
		//check id avaliable
		if(!list[curPart][id]){
			console.log('framer.jump('+id+') fonskiyonuna girilen id numarasıyla bir frame bulunamadı');
			return false;
		}
		
		//check paused
		if(!paused){this.pause();}
		
		//get metod
		metod = id<=curFrame?"undo":"instant";
		
		timeOuts = [];//this.timeOuts[] arrayı sıfırlanır.
		
		if(metod === "undo"){
			for ( ; i>=id ; i-- ){
				doUndo(i);
			}
		}
		
		if(metod === "instant"){
			for( ; i<id; i++){
				doInstant(i);
				//current frame de instant işleminde nextFunc değişkeni kullanlır diğer framlere geçiş yapıldığnda
				//bu değişken sıfırlanmalıdır
				if(say === 0 ){nextFunc = 0;}
				say++;
			}
		}
		return this.start(id);
	
			
	};//bir frame çalışırken veya pause durumundayken başka bir frame'ye geçmeyi sağlar.
	framer.saveState = function(){
		//save edilmeden mutlaka pause işlemi gerçekleştirilmelidir.
		if(!paused){return false;}
		save[curPart] = {
			curPart:curPart,
			curFrame:curFrame,
			curFunc:curFunc,
			nextFunc:nextFunc,
			paused:paused,
			undo:undo,
			timeOuts:timeOuts,
			ended:ended
		};
		
		return true;
		
	};//sunumu yapılmakta olan partın o anki durumunu kayıt eder.
	framer.loadState = function(id){
		//frame yüklenmeden önce mutlaka geçerli frame pause edilmelidir. eğer gerekiyorsa save edilip sonra
		//loadState() fonksiyonu çalıştırılmalıdır.
		var state = save[id];
		if(!state || !paused){
			return false;
		}

		curPart = state.curPart;
		curFrame = state.curFrame;
		curFunc = state.curFunc;
		nextFunc = state.nextFunc;
		paused = state.paused;
		undo = state.undo;
		timeOuts = state.timeOuts;
		ended = state.ended;
		
		return true;
		
	};//önceden kayıt edilmiş bir state'in yeniden yüklenmesi
	framer.loadPart = function(id,loadState){
		
		//id = part id;
		//loadState = false || true; yüklenen yeni partın en baştan mı yoksa daha önce kaldığı bir noktadan mı çalıştırılacağı.
		//return değeri part'a ait verilerin barındıran bir objedir.
		/*return {
			title :["başlık1","başlık2","başlık3"....] -> her bir frame için girilen başlık
			curFrame: id  -> çalışan veya pause durumunda olan şuanki framin id no'su
			paused : true ||false -> sunumun pause durumunda olup olmadığı
			curPart: id -> yeni yüklenen partın id no'su
			frameCount : part içinde kaç adet frame bulunduğu.
		}*/
		var loaded = false;//loadState() fonksiyonu kayıtlı veri bulamaz ise false döndürür eğer bulup yükler ise true döndürür. Bu değer bu değişkende saklanıp framerCtrl.loadPart() fonksiyonuna geri gönderilir. böylece bu fonksiyon eğer bir save yüklendiyse resume() fonksiyonu çalıştırır eğer yüklenecek save yok ise partı en baştan start() fonksiyonu ile başlatır.
		if(!list[id]){
			return false;
		}
		
		//eğer pause durumda değil ise pause edilerek timeOuts lar temizlenir
		if(!paused){framer.pause();}
		
		undo = [];//undo arrayı temizlenir
		timeOuts = []//timeOuts nesnesi temizlenir.
		curPart = id;// geçerli part değişkeni yeniden atanır.
		curFrame = 0;
		
		//bu aşamada çalışmakta olan part tamamen kaldırılmış ve bir sonraki part framer'a yüklenmiş olur.
		//buradan sonra start(0) ile yeni partın ilk frami başlatılabilir
		//veya this.loadSate ile daha önceden bu partın kaldığı bir noktadan devam etmesi sağlanabilir.
		
		//ilk frameden başlamak
		
		if(loadState){
			 loaded = framer.loadState(id);
		}
		
		return {
			title:getTitles(),
			curPart : curPart,
			curFrame : curFrame,
			paused : paused,
			frameCount : list[curPart].length,
			loaded:loaded,
			ended : ended
		};
	
	};//istenilen partı yükler.
	
	
	//init Metodları
	framer.fn = init.prototype;
	
	//CSS FUNCTİONS
	framer.fn.css = function(css,timeOut){
		// css = {"display":none, "attr":"value" ....} şeklinde object
		//start = ms cinsinden fonksiyonun başlatılacağı zaman
		//her bir framein başlangıç zamanı 0 olarak alınmaktadır. buna göre framer.method() fonksiyonlarına
		//gönderilecek zaman değerleri sadece o frame için geçerli olacak şekilde düşünülmelidir.

		
		var $el = this[0],
			type = "css",
			curCss = {},//undo işlemi için kullanılacak css nesnesi
			func = null, //callBack fonksiyon olarak timeOuts arrayına gönderilecek olan fonksiyon
			_undo = null;//undo işlemini gerçekleştirecek olan fonksiyon
		
		
		//argüman kontrolü
		if($el.length<1 || !isInt(timeOut) || typeof css !== "object"){
			console.log("framer().css() fonksiyonunun argümanları sorunlu");
			return this;
		}
		
		if(!isNext()){return this;}
		
		//undo fonksiyonunun hazırlanması
		curCss = getCurCss();
		_undo = function(){			
			$el.css(curCss);
		};
		
		//mode "run" işlemleri
		if(mode === "run"){
			func = function(){
				$el.css(css);
				
				addUndo(type,_undo);
			};
			addTimeOut(func,timeOut,type); 
			
		}
		
		
		//mode "instant" işlemleri
		if(mode === "instant"){
			$el.css(css);
			addUndo(type,_undo);
		}
		
		//functions
		function getCurCss(){
			var i,
				curCss = {};			
			for (i in css) {
				if (css.hasOwnProperty(i)) {
					curCss[i] = $el.css(i);
				}
			}
			return curCss;
		}
		
		
		
		return this;
		
		
	};
	
	//ADD STEM FUNCTİONS
	//for using following methods addStem.js must be added into the page before framer.js
	framer.fn.addStem = function(hOpt, trg, tOpt, timeOut){
		//hOpt === host options
		//trg === selector or array for addStem().to(trg, opt) method
		//tOpt === target options
		var $el = this[0],
			type = "addStem",
			stem = {},
			func_ = null, //callBack fonksiyon olarak timeOuts arrayına gönderilecek olan fonksiyon
			undo_ = null;//undo işlemini gerçekleştirecek olan fonksiyon
		
		
		
		
		if(!isNext()){return this;}
		
		
		func_ = function(){
			stem = addStem( $el, hOpt ).to( trg, tOpt );
			$.data( $el[0] , "addStem", stem);
			undo_ = function(){
				var stem = $.data( $el[0] , "addStem");
				stem.destroy();
			};
			addUndo(type,undo_);
		};
		
		
		//mode run işlemleri
		if(mode==="run"){
			addTimeOut(func_,timeOut,type); 			
		}
		
		
		//mode instant işlemleri
		if(mode==="instant"){
			func_();
		}
		
		return this;
	};	
	framer.fn.removeStem = function(timeOut){
		//hOpt === host options
		//trg === selector or array for addStem().to(trg, opt) method
		//tOpt === target options
		var $el = this[0],
			type = "addStem",
			stem = {},
			func_ = null, //callBack fonksiyon olarak timeOuts arrayına gönderilecek olan fonksiyon
			undo_ = null;//undo işlemini gerçekleştirecek olan fonksiyon
			
		if(!isNext()){return this;}
		
		
		func_ = function(){
			stem = $.data( $el[0] , "addStem");
			stem.destroy();
			
			undo_ = function(){
				$.data( $el[0] , "addStem",stem);
				stem.updHost([0,0],true);
			};
			addUndo(type,undo_);
		};
		
		//mode run işlemleri
		if(mode==="run"){
			addTimeOut(func_,timeOut,type); 			
		}
		
		
		//mode instant işlemleri
		if(mode==="instant"){
			func_();
		}
		
		return this;
		
	};
	framer.fn.changeStem = function(hOpt, trg, tOpt, timeOut){
		//hOpt === host options
		//trg === selector or array for addStem().to(trg, opt) method
		//tOpt === target options
		var $el = this[0],
			type = "addStem",
			oldStem = {},
			stem = {},
			func_ = null, //callBack fonksiyon olarak timeOuts arrayına gönderilecek olan fonksiyon
			undo_ = null;//undo işlemini gerçekleştirecek olan fonksiyon
			
		if(!isNext()){return this;}

		
		func_ = function(){
			//store old stem
			oldStem = $.data( $el[0] , "addStem");
			//destroy current stem
			$.data( $el[0] , "addStem").destroy();
			//create new stem
			stem = addStem( $el, hOpt ).to( trg, tOpt );			
			$.data( $el[0] , "addStem", stem);
			
			undo_ = function(){
				stem.destroy();
				$.data( $el[0] , "addStem", oldStem);
				oldStem.updHost([0,0],true);
				
			};
			addUndo(type,undo_);
		};
		
		//mode run işlemleri
		if(mode==="run"){
			addTimeOut(func_,timeOut,type); 			
		}
		
		
		//mode instant işlemleri
		if(mode==="instant"){
			func_();
		}
		
		return this;
		
	};
	
	//TYPETHİS FUNCTİONS
	//for using following methods typeThis.js must be added into the page before framer.js
	framer.fn.typeThis = function(string, opt, timeOut){
		var $el = this[0],
			inner,//inner html of element
			type = "typeThis",
			func_ = {}, //callBack fonksiyon olarak timeOuts arrayına gönderilecek olan fonksiyon
			undo_ = null;//undo işlemini gerçekleştirecek olan fonksiyon
			
		if(!isNext()){return this;}
			
		//get inner
		inner = $el[0].innerHTML;
		//create undo function
		undo_ = function(){
			$el[0].style.display = "none";
			$el[0].innerHTML = inner;
		};
		//creating live function
		func_.live = function(){
			//it creates an object in global live variable
			var obj = {};
			
			obj.constants = {
				part : curPart,
				el: $el,
				inner:inner,
				frame : curFrame,
				tt:null,//typeThis object
				undo:undo_,
				func : curFunc,
			};
			
			//undo in live
			obj.undo = function(){
				
				//destory type this object if it is still exist
				if(obj.constants.tt){
					obj.constants.tt.destroy();
				}
				
				//run undo method
				obj.constants.undo();
			};
			
			//instat method for live object, this will be called by doInstant( frame id ) method
			obj.instant = function(){
				var part = obj.constants.part,
					frame = obj.constants.frame,
					func = obj.constants.func;
				//destroy type this object
				this.destroy();
				
				//restore inner HTML of host element
				this.constants.el[0].innerHTML = this.constants.inner;
				
				//remove this object from live object
				live[part][frame][func] = null;
				delete live[part][frame][func];
				
			};
			
			obj.start = function(){
				
				var options = {};
				
				//this will destroey typeThis when it is end
				//and remove it from live object
				options.onEnd = function(element, steps){
					var part = obj.constants.part,
						frame = obj.constants.frame,
						func = obj.constants.func;
					//destroy typeThis					
					obj.constants.tt.destroy();
					obj.constants.tt = null;
					
					//remove from live object
					
					live[part][frame][func] = null;
					delete live[part][frame][func];
					
				};
				
				opt = $.extend({},opt,options);
				
				//restore display property
				$el[0].style.display = "";
				
				//add typeThis object
				this.constants.tt = $el.typeThis( opt );
				
				//add undto method
				addUndo(type,this.undo);
				
			};
			
			//this function will be called on framer.pause()
			obj.pause = function(){
				this.constants.tt.stop();
			};
			
			//this function will be called on framer.resume()
			obj.resume = function(){
				this.constants.tt.resume();
			};
			
			//this function will be called on finish job or on instant mode
			obj.destroy = function(){
				if(typeof obj.constants.tt === "object"){
					obj.constants.tt.destroy();
				}
			};
			
			
			if( typeof live[curPart] === "undefined"){
				live[curPart] = {};
			}
			
			if( typeof live[curPart][curFrame] === "undefined"){
				live[curPart][curFrame] = {};
			}
			
			live[curPart][curFrame][curFunc] = obj;
			live[curPart][curFrame][curFunc].start();
		};
		
		//function for instant mode
		func_.instant = function(){
			$el[0].style.display = "";
			addUndo(type,undo_);
		};
		
		//mode "run" işlemleri
		if(mode === "run"){
			addTimeOut(func_.live,timeOut,type); 			
		}
		
		
		//mode "instant" işlemleri
		if(mode === "instant"){
			func_.instant();
			
		}
		return this;
	};
	
	
	
	//CSS ANİMATİONS
	//it only supports numaretic css properties
	//value must be number or px
	//relative syntax can be used "+=50px" or "-=50px"
	//you can't use shorthand $.animate syntax like "toggle","hide"
	framer.fn.animate = function(css, duration, timeOut){
		var $el = this[0],
			inner,//inner html of element
			type = "animate",
			curCss,//orjinal css
			trgCss,// converted target css values,  if value given as relative
			func_ = {}, //callBack fonksiyon olarak timeOuts arrayına gönderilecek olan fonksiyon
			undo_ = null,//undo işlemini gerçekleştirecek olan fonksiyon
			inst_ = null;//instant işlemini gerçekleştirecek olan fonksiyon
			
		if(!isNext()){return this;}
		
		//save orjinal css
		curCss = getCurCss();
		
		//calculate target css
		trgCss = absoluteCss(css, $el);
		
		//undo function
		undo_ = function(){
			$el.css( curCss );
		};
		
		
		func_.live = function(){
			//it creates an object in global live variable
			var obj = {};
			
			obj.constants = {
				el: $el,
				css:trgCss,
				curCss:curCss,
				remain:duration,//remaining time
				part : curPart,
				frame : curFrame,
				func : curFunc,
			};
			
			//undo in live
			obj.undo = function(){
				//stop current animation in case it is still running
				obj.constants.el.stop();
				
				obj.constants.el.css( obj.constants.curCss );
				
			};
			
			//instant in live
			
			obj.instant = function(){
				//stop current animation in case it is still running
				obj.constants.el.stop();
				
				obj.constants.el.css( obj.constants.css );
			};
			
			obj.start = function(){
				
				this.animate();
				
				//add undto method
				addUndo(type,this.undo);
			};
			
			obj.pause = function(){
				this.constants.el.stop();
			};
			
			obj.resume = function(){
				this.animate();
			};
			
			obj.animate = function(){
				var self = this,
					$el = this.constants.el;
				
				//start animatation
				$el.animate( this.constants.css,{
					progress:onProgress,
					complete:onFinish,
					duration:this.constants.remain
				});
				
				
					
				function onProgress(a,b, remain){
					self.constants.remain = remain;
				}
				function onFinish(){
					var part = self.constants.part,
						frame = self.constants.frame,
						func = self.constants.func;
						
						
						//delete this object from live object
						live[part][frame][func] = null;
						delete live[part][frame][func];
				}
				
			};
			
			
			
			if( typeof live[curPart] === "undefined"){
				live[curPart] = {};
			}
			
			if( typeof live[curPart][curFrame] === "undefined"){
				live[curPart][curFrame] = {};
			}
			
			live[curPart][curFrame][curFunc] = obj;
			live[curPart][curFrame][curFunc].start();
		};
		
		//function for instant mode
		func_.instant = function(){
			$el.css( trgCss );
			addUndo(type,undo_);
		};
		
		//mode "run" işlemleri
		if(mode === "run"){
			addTimeOut(func_.live,timeOut,type); 			
		}
		
		
		//mode "instant" işlemleri
		if(mode === "instant"){
			func_.instant();
			
		}

		
		//functions
		function getCurCss(){
			var i,
				curCss = {};			
			for (i in css) {
				if (css.hasOwnProperty(i)) {
					curCss[i] = $el.css(i);
				}
			}
			return curCss;
		}
		
		function absoluteCss(css, $el){
			//function will convert css value to absolute if it given as relative
			//css ==== object tthat contains css property name and it's value pair.
			//$el === HTML node wrapped by jquery
			
			var reg = /^\s?(\+|-)=(\d+)/i,
				cur,//current css value in for loop
				val,//value of $el's current css
				test,
				k;
				
			for(k in css){
				if(css.hasOwnProperty(k)){
					cur = css[k];
					test = cur.match(reg);
					//if relative styntax has been found
					if(test){
						//get css value from html element
						val = $el.css(k);
						//check value is int
						val = parseInt(val, 10);
						if( isNaN( val ) ){
							//if value is nan
							css[k] = 0;
						}else{
							css[k] = val + parseInt( test[1] + test[2] , 10 ) +"px";							
						}
					}
					
				}
			}
			
			return css;
		}
		
		return this;
	};
	
	
	//DOTTER
	//for using following methods both typeThis.js and dotter.js must be added into the page before framer.js
	framer.fn.addDot = function(shape, dOpt, tOpt, timeOut){
		//shape === dotter type "line", "circle" or "suqare"
		//dOpt === dotter options
		//tOpt === typeThis options	
		var $el = this[0],
			type = "addDot",
			tt,
			dotter,
			func_ = {}, //callBack fonksiyon olarak timeOuts arrayına gönderilecek olan fonksiyon
			undo_ = null,//undo işlemini gerçekleştirecek olan fonksiyon
			inst_ = null;//instant işlemini gerçekleştirecek olan fonksiyon
			
		if(!isNext()){return this;}
		
		func_.live = function(){
			var obj = {};
			
			obj.constants = {
				el: $el,
				part : curPart,
				frame : curFrame,
				func : curFunc,
				
				dotter : null,
				wrpInner:null,
				tt:null,
				shape:shape,
				dOpt:dOpt,
				tOpt:tOpt,
			};
			
			obj.undo = function(){
				//destroy typeThis	
				if(obj.constants.tt){
					obj.constants.tt.destroy();
					obj.constants.tt = null;
				}			
					
				if(obj.constants.dotter){
					obj.constants.dotter.destroy();
					obj.constants.dotter = null;
				}	
		
			};
			
			obj.pause = function(){
				if(obj.constants.tt){
					obj.constants.tt.stop();
				}
			};
			
			obj.resume = function(){
				if(obj.constants.tt){
					obj.constants.tt.resume();
				}
			};
			
			obj.instant = function(){
				var wrp;
				
				if(obj.constants.tt){
					obj.constants.tt.destroy();
					obj.constants.tt = null;
				}
				//eğer animatsyon başladıktan sonra çağırıldıysa
				if(obj.constants.dotter){
					wrp = obj.constants.dotter.wrapper;
					wrp.innerHTML = obj.constants.wrpInner;
				}
				//eğer animasyon başlamadan çağırıldıysa	
				else{
					obj.constants.dotter = obj.constants.el.dotter( obj.constants.shape, obj.constants.dOpt );
				}
				
			};
			obj.start = function(){
				var options = {},
					wrp,
					opt;
				//add dotter
				this.constants.dotter = this.constants.el.dotter( this.constants.shape, this.constants.dOpt);
				
				wrp = $( this.constants.dotter.wrapper );
				
				this.constants.wrpInner = wrp[0].innerHTML;
				
				//add tt-animate class to all dots
				wrp.find(".dot").addClass("tt-animate");

				//this will destroey dotter and typeThis when it is end
				//and remove it from live object
				options.onEnd = function(element, steps){
					var part = obj.constants.part,
						frame = obj.constants.frame,
						func = obj.constants.func;
					//destroy typeThis					
					obj.constants.tt.destroy();
					obj.constants.tt = null;
					
					/*
					obj.constants.dotter.destroy();
					obj.constants.dotter = null;*/
					
					//remove from live object
					
					live[part][frame][func] = null;
					delete live[part][frame][func];
					
				};
				
				opt = $.extend({},this.constants.tOpt,options);
				

				
				//add typeThis object
				this.constants.tt = wrp.typeThis( opt );
				
				//add undto method
				addUndo(type,this.undo);
				
				
			};
			
			
			
			
			if( typeof live[curPart] === "undefined"){
				live[curPart] = {};
			}
			
			if( typeof live[curPart][curFrame] === "undefined"){
				live[curPart][curFrame] = {};
			}
			
			live[curPart][curFrame][curFunc] = obj;
			live[curPart][curFrame][curFunc].start();
		};
		func_.undo = function(){
			
			if(typeof dotter === "object"){
				dotter.destroy();
			}
		};
		func_.instant = function(){
			dotter = $el.dotter(shape, dOpt);
			addUndo(type,func_.undo);
		};
		
		
		
		
		
		
		//mode "run" işlemleri
		if(mode === "run"){
			addTimeOut(func_.live,timeOut,type); 			
		}
		
		
		//mode "instant" işlemleri
		if(mode === "instant"){
			func_.instant();
			
		}
		
		return this;
	};
	
	//remove dote id özelliği henüz desteklenmiyor. bunun sebebi addDot fonksiyonu undo edip yeni
	//dotter oluşturduğunda sürekli olarak dotter objesinin id numarası değişkemktedir.
	framer.fn.removeDot = function(id, timeOut){
		//id === specifies which dotter object will be removed, it can be number or array that carries ids
		// 1 or [0,2,3]
		//if it is ommited all of the dotter objects on the element will be removed
		
		var $el = this[0],
			type = "removeDot",
			dotter,
			func_ = {}; //callBack fonksiyon olarak timeOuts arrayına gönderilecek olan fonksiyon

			
		if(!isNext()){return this;}
		
		//parentmre kontrol
		if(typeof id === "undefined"){
			console.log("framer().removeDot() fonksiyonunun argümanları sorunlu");
			return this;
		}
		
		if(typeof timeOut === "undefined"){
			timeOut = id;
			id = false;
		}
		
		func_ = function(){
			var obj,//it will hold dotter object if there is one
				i = 0,
				list = [];//list of ids in array
				
				//get dotter object
				obj = $.data( $el[0] , "plugin_dotter" );
				
				
				//if there is no dotter object return here
				
				if(!obj){
					//add an empty callback to prevent run time error
					addUndo(type,function(){});
					return true;
				}
				
				//create list
				if(typeof id === "number"){
					list.push( id );
				}
				
				//if id is an array
				if(id.length){
					for( ; i<id.length; i++){
						list.push( id[i] );
					}
				}
				
				//if id is ommited
				//all of the dotter object will be removed
				if(id === false){
					for( ; i < obj.length; i++){
						list.push( i );
					}
				}
				
				
				for( i = 0 ; i< list.length; i++ ){
					if(obj[ list[i] ]){
						
						obj[list[i]].wrapper.style.display = "none";
					}
				}
				
				
				//add undo
				addUndo(type,undo_);
				
				//undo fonksiyonu
				function undo_(){
					var i = 0,
						curId;
					//find all deleted ıd and recreate them
					//deleted ids  stored in list array
					
					for( ; i< list.length; i++){
						curId = list[i];
						if(obj[curId] && obj[curId].wrapper){
							obj[curId].wrapper.style.display = "";
						}
					}

					obj = null;
				}
				
				
		};
		
		//mode "run" işlemleri
		if(mode === "run"){
			addTimeOut(func_,timeOut,type); 
			
		}
		
		
		//mode "instant" işlemleri
		if(mode === "instant"){
			func_();
		}
		
		return this;
	};
	
	
	
	framer.fn.next = function(timeOut){
		//bir sonraki frame (eğer varsa) o frame'e geçiş fonksiyonudur.
		//instant modu yoktur. instant modu sadece jump fonksiyonunda kullanılır. jump fonksiyonuda bir geçiş 
		//fonksiyonudur.
		//undo metodu eklemez çünkü çalıştığında geçerli frame sonlandırılacaktır.
		var type = "next",
			func = null;
			
		//argüman kontrolü
		if(!isInt(timeOut)){
			console.log("framer().next() fonksiyonunun argümanları sorunlu");
			return false;
		}
		
		
		//mode "run" işlemleri
		if(mode === "run"){
			func = function(){
				framerCtrl.jump(curFrame+1);
			};
			addTimeOut(func,timeOut,type);
		}
		
	};//bir sonraki frame'e atlatır.	
	framer.fn.end = function(timeOut){
		var type = "end",
			func = null;
			
		//argüman kontrolü
		if(!isInt(timeOut)){
			console.log("framer().end() fonksiyonunun argümanları sorunlu");
			return false;
		}
		
		
		//mode "run" işlemleri
		if(mode === "run"){
			func = function(){
				ended = true;
				framerCtrl.end();
			};
			addTimeOut(func,timeOut,type);
		}		
	};//bir parttaki tüm frameler bittiğinde çağırılır.
	
	
	
	//common functions
	function addTimeOut(callBack,timeOut,type){//timeOuts arrayını yeni fonksiyon ekler
		var key = timeOuts.length;//setTimeout() fonksiyonu çalıştığında kendi objesine bunu belirten bir flag
		//koymak için bu key değerini kullanır.timeOuts.length değeri = eklenecek objenin key değeri
		getMargin();
		var timeOut = timeOut+curMargin,
			obj = {
			timeOut:timeOut,
			func:callBack,
			//init fonksiyonu çalıştığında içindeki callBack() fonksiyonunu çalıştırmanın yanı sıra
			//bu fonksiyonun daha önceden çalışmış olduğunu belirtmek amacı ile key değerini kullanarak
			//timeOuts[key].timeOut property'sini false olarak set eder.
			init:setTimeout(function(){
				callBack();
				if(timeOuts[key]){
					timeOuts[key].timeOut = false;
				}
			},timeOut),
			type:type			
		};
		timeOuts.push(obj);
		
	}
	
	function addUndo(type,callBack){//undo arrayına yeni fonksiyon ekler
		undo[curFrame] = undo[curFrame] || {length:0};
		undo[curFrame][curFunc] = undo[curFrame][curFunc] || {type:type,callBack:callBack,keys:[curFrame, curFunc]};
		undo[curFrame].length++; 
		curFunc++;
	}
	
	function isNext(){
		//curFunc: değeri şuan yürütülmekte olan veya yürütülmek için bekleyen fonksiyonun id'nosunu tutar. her bir fonksiyon kendi işlevini gerçekleştirdiğinde (run modunda timeOuts[] içinde, instant modunda fonksiyonun kendisinin içinde) zorunlu olarak addUndo() metodu eklemektedir. addUndo() metodu içerisinde curFunc gloabl değeri 1 arttırılır ve böylece bir sonra çalışacak olan fonksiyon bu değere bakarak kendi id'nosunu tespit eder.
		//nextFunc ise sunum duraklatıldığında çalışmayı bekleyen sıradaki ilk fonksiyonun id'nosu nu tutar.
		//doİnstant metdou bir frame içindeki tüm fonksiyonları yeniden çalıştırdığından sunum duruklatılmadan önce çalışmış bir fonksiyonun instant modunda yeniden çalışmasını önlemek amacı ile isNext() fonksiyonu bu iki değişkeni kontrol ederek instant modunda çlaıştırılan bir fonksiyonun pas geçilip geçilmeyeceğine karar verir ve fonksiyonu pas geçtiği için curFunc değerini 1 arttırır
		if(curFunc<nextFunc){
			curFunc++;
			return false;
		}
		return true;
	}//bir fonksiyonun instant modunda çalıştırılıp çalıştırılmayacağını denetler

	//şaunki timestamp verisini timer değişkenine atar
	//bu fonksiyon geçerli frame çalıştırıldığında başlatılır
	function startClock(){
		timer = Date.now();	
	}
	
	
	//frame pause edildiğinde frame'in başlamasından bu yana ne kadar süre geçtiğini döndürür.
	function stopClock(){
		var curTime = Date.now() - timer;
		return curTime;
	}
	
	function startMargin(){
		margin = Date.now();
		curMargin = 0;
	}
	
	function getMargin(){
		curMargin = Date.now() - margin;
	}
	
	function doUndo (id){
		//***ÖNEMLİ : sunum run modunda çalışırken yani timeOuts objesinde hala bekleyen setTimeout() fonksiyonları var iken doUndo() fonksiyonu çalıştırılmamalıdır. undo çalıştırılmadan pause moduna alınmalı ve timeOuts[] arrayı temizlenmelidir.
		//id = undo işlemine tabi tutulacak framin id nosu
		var unList = undo[id],
			i = 0;
			
		if(!unList){
			return false;
		}
		
		for(i = (unList.length -1) ; i>=0; i--){
			unList[i].callBack();
			delete undo[id][i];
			undo[id].length--;
		}
		
		return true;
		
	};//verilen id'ye ait frame'in o ana kadar biriktirilmiş tüm undo() fonksiyonlarını en sondan başlayrak çalıştırır ve siler.
	
	function doInstant (id){
		//***ÖNEMLİ : sunum run modunda çalışırken yani timeOuts objesinde hala bekleyen setTimeout() fonksiyonlar var iken çalıştırılmamalıdır. timeOuts içerisinden bekleyen tüm fonksiyonlar temizlenmelidir.
		//id = instant modunda çalıştırılacak olan frame'in id nosu.
		//nextFunct : doInstant fonksiyonu çalıştırıldığında sunumun duruklatılmış olduğunu var sayıyoruz. Sunurum duruaklatıldığında çalışmakta olan framin bazı fonksiyonları çalıştırılmış bazı fonksiyonları ise bekleme durumunda olacaktır. nextFunc -> bekleme durumunda olan fonksiyonlardan ilk sırada olanın id'nosu (sıra numarası) dır.
		
		//sunum instant modunda çalıştırken her fonksiyon (this.css, this.animate... gibi) kendi id'nosu ile nextFunc id'no sunu karşılaştırır. eğer kendi id'si nextFunc id'sinden daha düşük ise bunun anlamı sunum duruaklatıldığında kendi sırasının geçmiş olduğudur(fonksiyon hali hazırda çalıştırılmış). bu durumda ilgili fonksiyon hiçbir işlem yapmadan sonlandırılacaktır.
		var k;
		mode = "instant";
		curFrame = id;
		curFunc = 0;
		
		//live objesi içerisinde geçerli frame'e ait fonksiyon var ise bu fonksiyonların tümünin
		//instant metodları çalıştırılır.
		//trigger resume on live object
		if(live[curPart] && live[curPart][curFrame]){
			//for loop for each curFrame paroperty on live object
			for (k in live[curPart][curFrame]){
				if(live[curPart][curFrame].hasOwnProperty(k)){
					//trigger pause() fonktion of each live object
					live[curPart][curFrame][k].instant();
				}
			}
		}
		
		//henüz tetiklenmemiş fonksiyonların çalıştırılması
		//bir fonksiyon kendisinin tetiklenip tetiklenmediğini kontrol etmek için
		//kendi scope'u içerisinde isNext() fonksiyonunun döndüreceği değere bakar
		list[curPart][curFrame][0]();
		
	};//verilen id nolu frame'e ait tüm fonksiyonları (list["part"]) instant modunda çalıştırır.
	
	function getTitles(){
		
		var title = [],
			i = 0,
			frames = list[curPart] || false;
		if(frames){
			for( ; i<frames.length; i++){
				title.push(frames[i][1].title);
			}
		}
		return title;
	}//list[curPart] içindeki tüm framelere ait title verilerini array[] içinde döndürür
	//dönen arraydaki key değerleri ilgili framelerin id değerleridir.
	





	
	/*test function*/
	framer.getList = function(){
		return list;
	};
	framer.getUndo = function(){
		return undo;
	};
	framer.getTimeOuts = function(){
		return timeOuts;
	};

	window.framer = framer;
	//return framer;
})();//framerCore 

/***************FRAMER CONTROL******/
window.framerCtrl = (function(){
	var curPart = 0,//seçili olan partın id'nosu
		loadState = true,// manuel olarak burada belirtilir. true yapılırsa bir part yüklenirken daha önceden kayıtlı bir state var mı kontrol edilir. loadState= false durumunda saveState() fonksiyonları çağırılmaz yani kayıt alınmaz
		curFrame = 0,//ilk veri load() ile partInfodan gelir.
		paused = false,//ilk veri load() ile partInfodan gelir.
		frameCount = 0,//part içindeki frame sayısı partInfodan alınır.
		partInfo = {};
		
	
	
	
	
	

	//Listeden Part Seçimi 
	$("body").on("click","ul.sections li", function(){
		var $el = $(this),
			part = parseInt($el.data("id"));
		
		if($el.hasClass("selected")){
			return false;
		}
		
		if(loadState){
			pause();
			framer.saveState();
		}
		
		if(loadPart(part,loadState)){
			curPart = part;
			frameUi.builder.changeSelectedSection($el);
		}

		
	});
	
	//control panelinden pause stop next prev işlemleri
	$("body").on("click","aside.frame .control i, aside.frame .frameSlc li", function(){
		var tur ="",//tıklanılan elementin ne olduğu "play" "next" "prev"
			id = 0,//geçilecek framin id no su
			$el = $(this);
		tur = $el.data("tur");
		id = $el.data("id");
		if(touchScr){
			frameUi.frames.kapa();
		}
		
		if($el.hasClass("noJump")){
			return false;
		}
		
		switch(tur){
			case "play":
				if(paused){play();}else{pause();}
			break;
			
			case "jump":
				jump(id);
			break;
			
			/*case "next":
			break;*/
			
			case "replay":
				jump(0);
			break;
			
			default:
			break;
		}
	});
	
	function play(){
		if(framer.resume()){
			paused = false;
			frameUi.builder.assignFrameControl(paused,curFrame,frameCount);
		}
	}//sunumu pause modundan çıkartır.
	function pause(){
		if(framer.pause()){
			paused = true;
			frameUi.builder.assignFrameControl(paused,curFrame,frameCount);
		}
	}//sunumu pause moduna alır.
	function jump(id){
		if(id==="false"){return false;}
		id = parseInt(id,10);
		if(framer.jump(id)){
			curFrame = id;
			paused = false;
			frameUi.builder.assignFrameControl(paused,curFrame,frameCount);
			frameUi.builder.changeFrameLi(curFrame);
		}
	}//1frame ileri veya 1 frame geri atlar.
	function loadPart(id, loadState){
		//id = yüklenecek partın id no'su
		//loadState = true ise yüklenecek partın kaydedilmiş bir state'i varmı kontrol edilir var ise bu state yüklenir
		//loadState = false ise part yüklendikten sonra en baştan başlanır.
		var started = false,//framer.start() fonskiyonundan dönen değeri tutar
			_partInfo = false,//loadPart fonksiyonundan dönen veriyi tutar
			
		_partInfo = framer.loadPart(id,loadState);	
		//part yüklenemediyse kullanıcıya uyarı mesajı gönderilir.
		if(!_partInfo){
			alert("Sunumun bu bölümü yüklenemiyor.");
			return false;
			//partInfo = {title:[],curFrame:0,frameCount:0,paused:true}
		}	
			
		loadState = loadState || false;
		partInfo = _partInfo;
		
		if(loadState && _partInfo.loaded){
			play();
		}else{
			started = framer.start(0);
		}
		
		frameCount = partInfo.frameCount;
		paused = partInfo.paused =  false;//framer.start(0) yapıldığı için
		//parta ait bilgiler UI ye yüklenir.

		frameUi.builder.loadPart(_partInfo);
		return true;
	};//id no'lu partı sunum için yükler ve çalıştırır
 	function init(){
		//init : sayfa ilk yüklendiğinde part0 'ı UI'ye yükler.
		frameUi.builder.getSectionsName();
		frameUi.builder.createSections();
		//frameUi.builder.loadPart(framer.loadPart(curPart,false));
		loadPart(curPart,false);
		
	};//dokuman yüklendiğinde framer'i ilk başlatan fonksiyon
	function end(){
		frameUi.builder.assignFrameControl("replay",curFrame,frameCount);
		frameUi.builder.changeFrameLi(curFrame,true);
	};//bir part sonlandığında framer.end() tarafından çağırılır.
	
	
	
	return {
		jump : jump,
		init : init,
		end : end		
	};
})();//framerCtrl


})(jQuery);//framer Tüm




