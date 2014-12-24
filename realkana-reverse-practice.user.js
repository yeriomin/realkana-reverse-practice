// ==UserScript==
// @name         Realkana reverse practice
// @namespace    https://github.com/yeriomin
// @homepageURL  https://github.com/yeriomin/realkana-reverse-practice
// @downloadURL  https://raw.githubusercontent.com/yeriomin/realkana-reverse-practice/master/realkana-reverse-practice.user.js
// @updateURL    https://raw.githubusercontent.com/yeriomin/realkana-reverse-practice/master/realkana-reverse-practice.user.js
// @version      1.0
// @description  Adds an option to practice not by guessing syllables of random kana characters, but by guessing kana characters of random syllables
// @author       yeriomin
// @copyright    2014, yeriomin (https://github.com/yeriomin)
// @match        http://www.realkana.com/*
// @match        https://www.realkana.com/*
// @grant        GM_addStyle
// ==/UserScript==


RealKanaAddon = function() {

    var
        _counterRightId = 'right',
        _counterShownId = 'shown',
        _questionId = 'question',
        _correctAnswerId = 'correct',
        _chosenCharacters = [],
        _typeface = 1,
		_question_idx = -1,
		_typeface_idx = -1,
        _cookie = '',
        
        _CHARS = {
            あ:[0,0],い:[1,0],う:[2,0],え:[3,0],お:[4,0],か:[5,0],が:[6,0],き:[7,0],ぎ:[8,0],く:[9,0],
            ぐ:[0,1],け:[1,1],げ:[2,1],こ:[3,1],ご:[4,1],さ:[5,1],ざ:[6,1],し:[7,1],じ:[8,1],す:[9,1],
            ず:[0,2],せ:[1,2],ぜ:[2,2],そ:[3,2],ぞ:[4,2],た:[5,2],だ:[6,2],ち:[7,2],ぢ:[8,2],つ:[9,2],
            づ:[0,3],て:[1,3],で:[2,3],と:[3,3],ど:[4,3],な:[5,3],に:[6,3],ぬ:[7,3],ね:[8,3],の:[9,3],
            は:[0,4],ば:[1,4],ぱ:[2,4],ひ:[3,4],び:[4,4],ぴ:[5,4],ふ:[6,4],ぶ:[7,4],ぷ:[8,4],へ:[9,4],
            べ:[0,5],ぺ:[1,5],ほ:[2,5],ぼ:[3,5],ぽ:[4,5],ま:[5,5],み:[6,5],む:[7,5],め:[8,5],も:[9,5],
            ゃ:[0,6],や:[1,6],ゅ:[2,6],ゆ:[3,6],ょ:[4,6],よ:[5,6],ら:[6,6],り:[7,6],る:[8,6],れ:[9,6],
            ろ:[0,7],わ:[1,7],を:[2,7],ん:[3,7],ァ:[4,7],ア:[5,7],ィ:[6,7],イ:[7,7],ゥ:[8,7],ウ:[9,7],
            ェ:[0,8],エ:[1,8],ォ:[2,8],オ:[3,8],カ:[4,8],ガ:[5,8],キ:[6,8],ギ:[7,8],ク:[8,8],グ:[9,8],
            ケ:[0,9],ゲ:[1,9],コ:[2,9],ゴ:[3,9],サ:[4,9],ザ:[5,9],シ:[6,9],ジ:[7,9],ス:[8,9],ズ:[9,9],
            セ:[0,10],ゼ:[1,10],ソ:[2,10],ゾ:[3,10],タ:[4,10],ダ:[5,10],チ:[6,10],ヂ:[7,10],ツ:[8,10],ヅ:[9,10],
            テ:[0,11],デ:[1,11],ト:[2,11],ド:[3,11],ナ:[4,11],ニ:[5,11],ヌ:[6,11],ネ:[7,11],ノ:[8,11],ハ:[9,11],
            バ:[0,12],パ:[1,12],ヒ:[2,12],ビ:[3,12],ピ:[4,12],フ:[5,12],ブ:[6,12],プ:[7,12],ヘ:[8,12],ベ:[9,12],
            ペ:[0,13],ホ:[1,13],ボ:[2,13],ポ:[3,13],マ:[4,13],ミ:[5,13],ム:[6,13],メ:[7,13],モ:[8,13],ャ:[9,13],
            ヤ:[0,14],ュ:[1,14],ユ:[2,14],ョ:[3,14],ヨ:[4,14],ラ:[5,14],リ:[6,14],ル:[7,14],レ:[8,14],ロ:[9,14],
            ワ:[0,15],ヲ:[1,15],ン:[2,15],ヴ:[3,15]
        },

        _COLUMNS = [
            [['あ','a'],['い','i'],['う','u'],['え','e'],['お','o']],
            [['か','ka'],['き','ki'],['く','ku'],['け','ke'],['こ','ko']],
            [['さ','sa'],['し','shi'],['す','su'],['せ','se'],['そ','so']],
            [['た','ta'],['ち','chi'],['つ','tsu'],['て','te'],['と','to']],
            [['な','na'],['に','ni'],['ぬ','nu'],['ね','ne'],['の','no']],
            [['は','ha'],['ひ','hi'],['ふ','fu'],['へ','he'],['ほ','ho']],
            [['ま','ma'],['み','mi'],['む','mu'],['め','me'],['も','mo']],
            [['や','ya'],['ゆ','yu'],['よ','yo']],
            [['ら','ra'],['り','ri'],['る','ru'],['れ','re'],['ろ','ro']],
            [['わ','wa'],['を','o']],
            [['ん','n']],
            [['が','ga'],['ぎ','gi'],['ぐ','gu'],['げ','ge'],['ご','go']],
            [['ざ','za'],['じ','ji'],['ず','zu'],['ぜ','ze'],['ぞ','zo']],
            [['だ','da'],['ぢ','ji'],['づ','zu'],['で','de'],['ど','do']],
            [['ば','ba'],['び','bi'],['ぶ','bu'],['べ','be'],['ぼ','bo']],
            [['ぱ','pa'],['ぴ','pi'],['ぷ','pu'],['ぺ','pe'],['ぽ','po']],
            [['きゃ','kya'],['きゅ','kyu'],['きょ','kyo']],
            [['しゃ','sha'],['しゅ','shu'],['しょ','sho']],
            [['ちゃ','cha'],['ちゅ','chu'],['ちょ','cho']],
            [['にゃ','nya'],['にゅ','nyu'],['にょ','nyo']],
            [['ひゃ','hya'],['ひゅ','hyu'],['ひょ','hyo']],
            [['みゃ','mya'],['みゅ','myu'],['みょ','myo']],
            [['りゃ','rya'],['りゅ','ryu'],['りょ','ryo']],
            [['ぎゃ','gya'],['ぎゅ','gyu'],['ぎょ','gyo']],
            [['じゃ','ja'],['じゅ','ju'],['じょ','jo']],
            [['ぢゃ','ja'],['ぢゅ','ju'],['ぢょ','jo']],
            [['びゃ','bya'],['びゅ','byu'],['びょ','byo']],
            [['ぴゃ','pya'],['ぴゅ','pyu'],['ぴょ','pyo']],
            [['ア','a'],['イ','i'],['ウ','u'],['エ','e'],['オ','o']],
            [['カ','ka'],['キ','ki'],['ク','ku'],['ケ','ke'],['コ','ko']],
            [['サ','sa'],['シ','shi'],['ス','su'],['セ','se'],['ソ','so']],
            [['タ','ta'],['チ','chi'],['ツ','tsu'],['テ','te'],['ト','to']],
            [['ナ','na'],['ニ','ni'],['ヌ','nu'],['ネ','ne'],['ノ','no']],
            [['ハ','ha'],['ヒ','hi'],['フ','fu'],['ヘ','he'],['ホ','ho']],
            [['マ','ma'],['ミ','mi'],['ム','mu'],['メ','me'],['モ','mo']],
            [['ヤ','ya'],['ユ','yu'],['ヨ','yo']],
            [['ラ','ra'],['リ','ri'],['ル','ru'],['レ','re'],['ロ','ro']],
            [['ワ','wa'],['ヲ','o']],
            [['ン','n']],
            [['ガ','ga'],['ギ','gi'],['グ','gu'],['ゲ','ge'],['ゴ','go']],
            [['ザ','za'],['ジ','ji'],['ズ','zu'],['ゼ','ze'],['ゾ','zo']],
            [['ダ','da'],['ヂ','ji'],['ヅ','zu'],['デ','de'],['ド','do']],
            [['バ','ba'],['ビ','bi'],['ブ','bu'],['ベ','be'],['ボ','bo']],
            [['パ','pa'],['ピ','pi'],['プ','pu'],['ペ','pe'],['ポ','po']],
            [['キャ','kya'],['キュ','kyu'],['キョ','kyo']],
            [['シャ','sha'],['シュ','shu'],['ショ','sho']],
            [['チャ','cha'],['チュ','chu'],['チョ','cho']],
            [['ニャ','nya'],['ニュ','nyu'],['ニョ','nyo']],
            [['ヒャ','hya'],['ヒュ','hyu'],['ヒョ','hyo']],
            [['ミャ','mya'],['ミュ','myu'],['ミョ','myo']],
            [['リャ','rya'],['リュ','ryu'],['リョ','ryo']],
            [['ギャ','gya'],['ギュ','gyu'],['ギョ','gyo']],
            [['ジャ','ja'],['ジュ','ju'],['ジョ','jo']],
            [['ヂャ','ja'],['ヂュ','ju'],['ヂョ','jo']],
            [['ビャ','bya'],['ビュ','byu'],['ビョ','byo']],
            [['ピャ','pya'],['ピュ','pyu'],['ピョ','pyo']],
            [['イェ','ye']],
            [['ウィ','wi'],['ウェ','we'],['ウォ','wo']],
            [['ヴァ','va'],['ヴィ','vi'],['ヴ','vu'],['ヴェ','ve'],['ヴォ','vo']],
            [['シェ','she']],
            [['ジェ','je']],
            [['チェ','che']],
            [['ティ','ti'],['トゥ','tu']],
            [['ディ','di'],['ドゥ','du']],
            [['ツァ','tsa'],['ツィ','tsi'],['ツェ','tse'],['ツォ','tso']],
            [['ファ','fa'],['フィ','fi'],['フェ','fe'],['フォ','fo']],
            [['ヴャ','vya'],['ヴュ','vyu'],['ヴョ','vyo']],
            [['テュ','tyu']],
            [['デュ','dyu']],
            [['フュ','fyu']]
        ],

        _KANA = {
            h: { columns: 16, offset: 0 },
            hd: { columns: 12, offset: 16 },
            k: { columns: 16, offset: 28 },
            kd: { columns: 12, offset: 44 },
            ke: { columns: 14, offset: 56 }
        }
    ;

    function initPage() {
        var _question, _value, _pow, _kana, _i, _j, _attempt;
        // Copying stuff from the original to get chosen kana columns from the cookie
        _cookie = 'b1h1hd0k0kd0ke0p1t1';
        if ( document.cookie.search( /a=(b\dh(\d+)hd(\d+)k(\d+)kd(\d+)ke(\d+)p\dt\d+)/ ) != -1 ) {
            _cookie = RegExp.$1;
        }
        if (_cookie.search(/h0hd0k0kd0ke0/) != -1) {
            _cookie = _cookie.replace(/h0/, 'h1');
        }
        if (_cookie.search(/t0/) != -1) {
            _cookie = _cookie.replace(/t0/, 't1');
        }
        _chosenCharacters = _typefaces = [];
        _columns = _cookie.match(/(h\d+)(hd\d+)(k\d+)(kd\d+)(ke\d+)/);
        _columns.shift();
        for (_i = 0; _i < 5; _i++) {
            _kana = _columns[_i].match(/([dehk]+)(\d+)/);
            _kana.shift();
            _kana[ 1 ] -= 0;
            if (_kana[1]) {
                _j = _KANA[_kana[0]].columns;
                while (_j) {
                    if (_kana[1] >= (_pow = Math.pow(2, --_j))) {
                        _kana[1] -= _pow;
                        _chosenCharacters = _chosenCharacters.concat(_COLUMNS[_j + _KANA[_kana[0]].offset]);
                    }
                }
            }
        }
        _cookie.match(/t(\d+)/);
        _value = RegExp.$1;
        _i = 9;
        while (_i) {
            if (_value >= (_pow = Math.pow(2, --_i))) {
                _value -= _pow;
                _typefaces.push(_i + 1);
            }
        }
        do {
			_attempt = Math.floor(Math.random() * _chosenCharacters.length);
			if (_chosenCharacters.length == 1) { break; }
		} while (_attempt == _question_idx);
		_question_idx = _attempt;
		_question = _chosenCharacters[_question_idx];
		_attempt = -1;
		do {
			_attempt = Math.floor(Math.random() * _typefaces.length);
			if (_typefaces.length == 1) { break; }
		} while (_attempt == _typeface_idx);
		_typeface_idx = _attempt;
		_typeface = _typefaces[ _typeface_idx ] - 1;
        // Removing stuff from the original practice page
        var elementQuestion = document.getElementById(_question);
        if (elementQuestion !== null) {
            elementQuestion.innerHTML = '';
        }
        var elementCounterRight = document.getElementById(_counterRightId);
        if (elementCounterRight !== null) {
            elementCounterRight.textContent = '0';
        }
        var elementCounterShown = document.getElementById(_counterShownId);
        if (elementCounterShown !== null) {
            elementCounterShown.textContent = '0';
        }
        var elementsP = document.getElementsByTagName('p');
        if (elementsP.length > 0) {
            elementsP[0].textContent = 'Click the correct character for the given syllable. Hover over the syllable to get a hint.';
        }
        var elementAnswer = document.getElementById('answer');
        if (elementAnswer !== null) {
            elementAnswer.outerHTML = '';
        }
        var elementsInput = document.getElementsByTagName('input');
        if (elementsInput.length > 0) {
            elementsInput[0].outerHTML = '';
        }
        // Drawing the question
        drawQuestion();
    }

    function drawQuestion() {
        // Choosing answer
        var answer = chooseCharacter();
        // Choosing options
        var options = [];
        var num = 5;
        while (num > 0) {
            var option = chooseCharacter();
            if (options.indexOf(option) != -1 || option == answer) {
                continue;
            }
            options.push(option);
            num--;
        }
        // Adding answer to the options at a random position
        var position = Math.floor(Math.random()*(options.length + 1));
        options.splice(position, 0, answer);
        // Drawing question
        buildQuestionElements(options, answer);
    }
    
    function isSelected(character) {
        for (var i in _chosenCharacters) {
            if (_chosenCharacters[i][0] == character) {
                return true;
            }
        }
        return false;
    }

    function incrementRightCounter() {
        var element = document.getElementById(_counterRightId);
        element.textContent = element.textContent - 0 + 1;
    }
    
    function incrementShownCounter() {
        var element = document.getElementById(_counterShownId);
        element.textContent = element.textContent - 0 + 1;
    }
    
    function chooseCharacter() {
        var randomNumber = Math.floor(Math.random() * _chosenCharacters.length);
        return _chosenCharacters[randomNumber][0];
    }
    
    function getSyllable(character) {
        for (var i in _chosenCharacters) {
            if (_chosenCharacters[i][0] == character) {
                return _chosenCharacters[i][1];
            }
        }
        console.log('Could not find syllable for character ' + character);
    }

    function getGlyphPosition(character) {
        return '-' + ((_CHARS[character][0]*50) + (_typeface*500)) + 'px -' + (_CHARS[character][1]*50) + 'px';
    }
    
    function buildQuestionElements(options, answer) {
        var syllable = getSyllable(answer);
        console.log(answer + ' ' + syllable);
        var root = document.getElementById(_questionId);
        // Clearing question container
        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }
        // Adding syllable element
        var elementSyllable = document.createElement('div');
        elementSyllable.appendChild(document.createTextNode(syllable));
        root.appendChild(elementSyllable);
        // Adding options element
        var optionsElement = document.createElement('div');
        optionsElement.setAttribute('id', 'options');
        for (var i in options) {
            var character = options[i];
            var optionElement = document.createElement('span');
            optionElement.style.backgroundPosition = getGlyphPosition(character);
            // Only clicking the correct option gets you the point
            if (character == answer) {
                optionElement.setAttribute('id', _correctAnswerId);
            }
            // Anyway we need to increment the 'shown' counter and show the next question
            optionElement.addEventListener('click', function() {
                document.getElementById('download').style.display = 'none';
                document.getElementById('score').style.display = 'block';
                incrementShownCounter();
                drawQuestion();
            });
            optionsElement.appendChild(optionElement);
        }
        root.appendChild(optionsElement);
        // Also lets show user the right answer by highlighting it if he hovers over the syllable
        elementSyllable.addEventListener('mouseover', function() {
            document.getElementById(_correctAnswerId).style.borderColor = 'black';
        });
        document.getElementById(_correctAnswerId).addEventListener('click', function() {
            incrementRightCounter();
        });
    }
    
    return {
        init: function() {
            initPage();
        }
    };
}();

// Adding one more button to all the pages
var newButton = document.getElementById('tabs').lastChild.cloneNode(true);
newButton.removeAttribute('id');
newButton.firstChild.setAttribute('href', '/practice/#reverse');
newButton.firstChild.innerHTML = 'Ecitcarp';
newButton.onclick = function() {location.reload();};
document.getElementById('tabs').lastChild.onclick = function() {location.reload();};
document.getElementById('tabs').appendChild(newButton);
GM_addStyle('#tabs li:last-child a, #tabs li a { width: 89px; } #options span { border-style: dashed; border-width: 1px; border-color: transparent; } #question div:first-child { font-size: 20pt; padding-bottom: 20px; }');

// We are on the reverse practice page
if (location.hash == '#reverse') {
    document.getElementById('front').removeAttribute('id');
    document.getElementById('tabs').lastChild.setAttribute('id', 'front');
    RealKanaAddon.init();
}
