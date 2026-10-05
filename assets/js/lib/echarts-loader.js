/* ECharts on-demand loader: the homepage nebula does not use ECharts, so the
 * 1MB bundle is fetched only when a chart view is first rendered. The file
 * stays in the Service Worker precache for offline availability. */
(function(){
  var pending = null;
  window.ensureEcharts = function(){
    if (window.echarts) return Promise.resolve(window.echarts);
    if (pending) return pending;
    pending = new Promise(function(resolve, reject){
      var script = document.createElement('script');
      script.src = 'assets/vendor/echarts.min.js';
      script.async = true;
      script.onload = function(){
        if (window.echarts) resolve(window.echarts);
        else { pending = null; reject(new Error('echarts global missing after load')); }
      };
      script.onerror = function(){ pending = null; reject(new Error('echarts load failed')); };
      document.head.appendChild(script);
    });
    return pending;
  };
})();
