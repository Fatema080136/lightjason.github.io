"use strict";

jQuery(function() {

	// defines hover effects for literal
	[ "literal-annotation", "literal-values", "literal-functor", "literal-negation" ].forEach( function(i) {
		jQuery("#animate-"+i).hover( 
			function() { jQuery(".svg-"+i).attr("fill", "red"); },
			function() { jQuery(".svg-"+i).attr("fill", ""); } 
		);
	});

	jQuery("#animate-literal-raw").hover( 
			function() { jQuery(".svg-literal-raw").attr("fill", "#0a7bff"); },
			function() { jQuery(".svg-literal-raw").attr("fill", ""); } 
		);


	// defines hover effects for both agent-cycles (green symbols)
	[ ".svg-agentcycle-checkcontext", ".svg-agentcycle-unify", ".svg-agentcycle-action",
	 ".svg-agentcycle-execution", ".svg-agentcycle-beliefbase", ".svg-agentcycle-plans",
	 ".svg-agentcycle-intentions", ".svg-agentcycle-trigger"
	].forEach( function(i) {
		jQuery(i).hover( 
			function() { jQuery(i).attr("fill", "#0f0"); },
			function() { jQuery(i).attr("fill", "#dfd"); } 
		);
	});


	// defines hover effects for both agent-cycles (blue-grey symbols)
	[ ".svg-agentcycle-triggeritem" ].forEach( function(i) {
		jQuery(i).hover( 
			function() { jQuery(i).attr("fill", "#0a7bff"); },
			function() { jQuery(i).attr("fill", "#ccc"); } 
		);
	});	
} );
