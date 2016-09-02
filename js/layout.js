/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function loadLayout() {
    $("#topHead").load("head.htm");
    $("#navBar").load("leftnav.htm");
    $("#sitefoot").load("sitefoot.htm");


    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-36133076-1']);
    _gaq.push(['_trackPageview']);

    (function () {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    })();

}
