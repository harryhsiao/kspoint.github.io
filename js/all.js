/*

本篇重點為:
1.剛進入網頁時,會顯示一筆預設資料
2.可用下拉視選單篩選資料(撈取降雨資料的作業中有教)
3.可以即時計算點擊率,並自動排出熱門地區按鈕,可利用這些按鈕來篩選資料
4.頁碼會隨上述功能改變(如:總資料為120筆,每頁顯示6筆資料,1.會顯示20頁,2.經篩選後若符合的資料有36筆,則顯示為6頁,3.排出名次後,符合第一名地區的資料共有12筆,顯示頁數為2頁)

*/



let wait =document.querySelector('.loading');
const zonedata=[];//製作一個空陣列來儲存JSON/result/records裡的景點資料
(function getinfo(){//利用立即函示IIFE''(function(){})();''來製作,以利後續''熱門區域''按鈕以及''下拉選單''篩選功能的製作

	const getpointinfo = new XMLHttpRequest();
	getpointinfo.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97');//利用XMLHttpRequest從網路上抓取高雄市政府的開放資料''第4及第5行''

	getpointinfo.onreadystatechange = function() {//利用onreadystatechange來監測readyState及status是否為正常(若讀取成功readyState會=4,status會=200)''本段用來擷取result/records資料''
		if (getpointinfo.readyState === 4 && getpointinfo.status === 200) {

			const data = JSON.parse(getpointinfo.responseText);
			const dataLen = data.result.records.length;
			const loading = "";

			for (let i = 0; dataLen > i; i++) {
				zonedata.push(data.result.records[i]);
			}
			
			pagination(zonedata, 1);
			dropmenu(zonedata);
		}
				
	};
	getpointinfo.send(null);
})();



function pagination(datas, nowpage) {//用來製作分頁號碼,datas為儲存資料的位置名稱,nowpage為儲存位置的第N筆資料''

  const totaldata = datas.length;//取得datas的資料總長度,用totaldata來代表
  const pageinfonum = 6;//我想要每頁呈現6筆資料
  const allpage = Math.ceil(totaldata / pageinfonum);//計算總頁數,避免出現小數點,所以取整數
  let currentPage = nowpage;//第27行到30行,為了防止js出錯所使用的機制,如果當前頁碼大於現在的頁碼(如:明明總共只有6頁,現在在第6頁,結果當前頁碼卻有7頁)
  if(currentPage > allpage){
  	currentPage = allpage;
  }
  const maxpage = currentPage * pageinfonum;//用來計算每頁顯示最大筆的資料(如:一共100筆資料[0,1,2,3,...],我要每頁顯示6筆,所以1*6=6,第一頁最大筆為第5筆的資料[0,1,2,3,4,5])
  const minpage = currentPage * pageinfonum - pageinfonum + 1;//用來計算每頁顯示最小筆的資料(如:一共100筆資料[0,1,2,3,...],我要每頁顯示6筆,所以1*6-6=0+1=1,第一頁最小筆為第1筆的資料[0,...]

  const pagedata = [];//用來儲存元素
  datas.forEach((element, index) => {
  const number = index + 1;//用來設計dataset的索引,能夠產生每個頁碼所需的索引資料,再用這個索引來表現切換功能
  if (number >= minpage && number <= maxpage) {
    pagedata.push(element);
  }
});

                       //{總頁數  ,  當前頁數    ,  往前一頁的按鈕        ,往下一頁的按鈕               }
   const pagemanager = {allpage , currentPage , pre: currentPage > 1 , next: currentPage < allpage};//利用鏡射原理,製作一組物件來供頁碼按鈕使用

  pageBtn(pagemanager);
  pointinfo(pagedata);

}

const pagen = document.querySelector('.pagen');
  
function pageBtn(parameter) {//第46行,開始製作頁碼按鈕,parameter為分頁的數字
  
  const allpage = parameter.allpage;  
  let str = '';
  
  if (parameter.pre) {
    
    str += `<li class="page-item">

      <a class="page-link" href="#" data-pages="${Number(parameter.currentPage) - 1}">&lt;&nbsp;prev</a> 

     </li>`;
  } 

  
  
  for (let i = 1; allpage >= i; i++) {
    
    if (Number(parameter.currentPage) === i) {
      str += `
      <li class="page-item">
        <a class="page-link active" href="#" data-pages="${i}">${i}</a>
      </li>
      `;
    } 
    else {
      
      str += `
      <li class="page-item">
        <a class="page-link" href="#" data-pages="${i}">${i}</a>
      </li>
      `;
    }
  }
  
  if (parameter.next) {    
    str += `
    <li class="page-item">

      <a class="page-link" href="#" data-pages="${Number(parameter.currentPage) + 1}">next&nbsp;&gt;</a>

    </li>
    `;
  } 

  pagen.innerHTML = str;
}

/*以下為預設資料,就是剛載入網頁時所顯示的資料*/
const cont = document.querySelector('.content');

function pointinfo(parameter){
	
	let str = "";
	for (let i = 0; i < parameter.length; i++) {
		str += `
		<div class="ca">
			<div class="card">
				<div class="card_photo">
					<img src="${parameter[i].Picture1}" alt="${parameter[i].Name}" >
					<div class="add_info">
						<h4 class="name">${parameter[i].Name}</h4>
						<p class="zone">${parameter[i].Zone}</p>
					</div>
				</div>
				<div class="card_info">
					<p class="opentime"><i class="fas fa-clock"></i>&nbsp;${parameter[i].Opentime}</p>
					<p class="address"><i class="fas fa-map-marker-alt fa-map-gps"></i>&nbsp;${parameter[i].Add}</p>
					<div class="card_infoflex">
						<p class="tele"><i class="fas fa-mobile-alt fa-mobile"></i>&nbsp;${parameter[i].Tel}</p>
						<p class="ticket"><i class="fas fa-tags text-warning"></i>&nbsp;${parameter[i].Ticketinfo}</p>
					</div>
				</div>
			</div>
		</div>
		`;
	}
	cont.innerHTML = str;
}



/*以下為製作下拉式選單的選項<option></option>*/

const area = document.querySelector('.area');

function dropmenu(parameter) {

  const zones = [];//用來儲存每一個區域的名稱
  
  parameter.forEach(function(element) {
    // indexOf() 指定搜尋 element.Zone
    // 當沒有找到回傳 -1，會 push 沒有的地區不重覆
    if (zones.indexOf(element.Zone) == -1) {
      zones.push(element.Zone);
    }
  });
  // view
  for (let i = 0; i < zones.length; i++) {
    const addoption = document.createElement('Option');
    addoption.textContent = zones[i];
    addoption.setAttribute('value', zones[i]);
    area.appendChild(addoption);
  }
  // 這是地區判斷值，留給分頁按鈕函式
  // 判斷現在頁面地區，是顯示哪一個地區，預設 HTML 是隱藏的
  zonetitle.textContent = '高雄全區';
};


/*以下為利用下拉式選單篩選的資料*/

const pointdata = []; //用來儲存篩選過後的資料
const zonetitle = document.querySelector('.zonetitle');

function selection(e) {  
  pointdata.length = 0;//先清空,避免過度儲存(如:假設三民區有3筆資料,鹽埕區有2筆資料,如果我先選三民區在選鹽埕區,資料串會儲存三民跟鹽埕加起來的5筆資料)
  
  zonetitle.textContent = e.target.value;//zonetitle的文字資料為選單裡區域的值(即<option></option>裡寫的文字)
 
  switch (true) {
    
    case e.target.value !== '高雄全區':
      
      for (let i = 0; zonedata.length > i; i++) {
        
        if (e.target.value === zonedata[i].Zone) {
          pointdata.push(zonedata[i]);
        }
      }
      
      pagination(pointdata, 1);
      break;
   
    default:

          pagination(zonedata, 1);//預設資料,當下拉選單選項為''--請選擇區域--''以及"高雄全區"時,則顯示原本的預設資料

      break;
  }
}

area.addEventListener('change', selection);


/*以下為用來產生熱門按鈕*/

const hotpoint=[];//用來儲存地區資料的點擊狀況
const item = JSON.parse(localStorage.getItem('allzone'))||[];//取出排行的資料
let hotzones = Object.keys(item).map(function(_) { return item[_]; });

area.addEventListener('change', clickoption);
function clickoption(e){
	 const option = e.target.value;	 
	 hotpoint.push(option);
	 localStorage.setItem('allzone', JSON.stringify(hotpoint));
}

function count() {	
	item.forEach(function(i) { hotzones[i] = (hotzones[i]||0) + 1;});
	const len = hotzones.length;
	const topcontent = document.querySelector('.topzone');  
  let hot = "";
	switch (true) {
		case len>5:

			hot+=`<input type="button" class="top one" value="`+hotzones[0]+`">
			<input type="button" class="top two" value="`+hotzones[1]+`">
			<input type="button" class="top three" value="`+hotzones[2]+`">
			<input type="button" class="top four" value="`+hotzones[3]+`">
			<input type="button" class="top five" value="`+hotzones[4]+`">
			`;
			break;
		default:
			hot+=`
			<input type="button" class="top one" value="三民區">
			<input type="button" class="top two" value="鹽埕區">
			<input type="button" class="top three" value="苓雅區">
			<input type="button" class="top four" value="新興區">
			<input type="button" class="top five" value="大樹區">
			`;
			break;
	}
   topcontent.innerHTML=hot;
}

count();




/*以下為利用熱門按鈕篩選過後的資料*/

function clickzone(e) {
 
  //e.preventDefault(); 
  if (e.target.type !== 'button') {
    return;
  }
  
  pointdata.length = 0;  
  zonetitle.textContent = e.target.value;

  switch (true) {
    
    case e.target.value !== '高雄全區':
      
      for (let i = 0; zonedata.length > i; i++) {
        
        if (e.target.value === zonedata[i].Zone) {
          pointdata.push(zonedata[i]);
        }
      }
    
      pagination(pointdata, 1);
      break;
    // 預設
    default:
 
      pagination(zonedata, 1);
      break;
  }
}
const topfive=document.querySelector('.topzone');
topfive.addEventListener('click',clickzone);



/*切換分頁數量*/
function clickpage(e) {
  e.preventDefault();
  if (e.target.nodeName !== 'A') {
    return;
  }
  const pagen = e.target.dataset.pages;//取得索引資料,索引代號為pages
  switch (true) {

		case zonetitle.textContent !== '高雄全區':// (第184行預設title的value為'高雄全區')

			pagination(pointdata, pagen);//分頁數量計算及顯示資料的筆數,pointdata為儲存地區資料用(從儲存總景點資料的zonedata裡來對比,如果總景點資料裡的Zone和option裡的地區吻合,就會存在這裡)

			break;

		default:
			// 預設使用全地區資料庫。
  pagination(zonedata, pagen);

  break;
}
}

pagen.addEventListener('click', clickpage);



/*回到頁首*/
var btt = document.querySelector('.gototop');
btt.addEventListener('click', goback);
window.addEventListener('scroll', scrollFunction);

function scrollFunction() {
  if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
    btt.style.display = "block";
  } else {
    btt.style.display = "none";
  }
}

function goback(e){
	e.preventDefault();
	window.scrollTo(0,0);
}

/*到資訊卡*/

var btp =document.querySelector('.gotopage');
btp.addEventListener('click', gottopage);
function gottopage(e){
	e.preventDefault();
	window.scrollTo(0,615);
}

