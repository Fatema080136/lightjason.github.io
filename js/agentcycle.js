"use strict"
jQuery(function(){["literal-annotation","literal-values","literal-functor","literal-negation"].forEach(function(t){jQuery("#animate-"+t).hover(function(){jQuery(".svg-"+t).attr("fill","red")},function(){jQuery(".svg-"+t).attr("fill","")})}),jQuery("#animate-literal-raw").hover(function(){jQuery(".svg-literal-raw").attr("fill","#0a7bff")},function(){jQuery(".svg-literal-raw").attr("fill","")}),[".svg-agentcycle-checkcontext",".svg-agentcycle-unify",".svg-agentcycle-action",".svg-agentcycle-execution",".svg-agentcycle-beliefbase",".svg-agentcycle-plans",".svg-agentcycle-intentions",".svg-agentcycle-trigger"].forEach(function(t){jQuery(t).hover(function(){jQuery(t).attr("fill","#0f0")},function(){jQuery(t).attr("fill","#dfd")})}),[".svg-agentcycle-triggeritem",".svg-agentcycle-events"].forEach(function(t){jQuery(t).hover(function(){jQuery(t).attr("fill","#0a7bff")},function(){jQuery(t).attr("fill","#ccc")})}),[".svg-agentcycle-planselect"].forEach(function(t){jQuery(t).hover(function(){jQuery(t).attr("fill","#ffad00")},function(){jQuery(t).attr("fill","#ffe400")})}),["literal-storage","literal-view"].forEach(function(t){jQuery("#animate-"+t).hover(function(){jQuery(".svg-"+t).attr("fill","#f90")},function(){jQuery(".svg-"+t).attr("fill","")})})})
