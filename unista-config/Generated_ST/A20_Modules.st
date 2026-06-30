ACTION A20_Modules: 
	
	// --------------------------------------------------------------------------------------------------------------- //
	// UNIT MACHINE
	// --------------------------------------------------------------------------------------------------------------- //

	pUM.Active							:= TRUE;
	pUM.ID								:= 0;

	// Configuration 
	pUM.Cfg.IsIndependant				:= FALSE;
	// ------------------------------------------------------------------------------------------------------- //
	// MODULE LIST 1 : EM1
	// ------------------------------------------------------------------------------------------------------- //

	// Format index with leading zero (e.g., 1 -> 01)
	pEM01.Active						:= TRUE;
	pEM01.ID							:= 1;

	// Configuration 
	pEM01.Cfg.IsIndependant				:= FALSE;
	// ------------------------------------------------------------------------------------------------------- //
	// MODULE LIST 2 : EM2
	// ------------------------------------------------------------------------------------------------------- //

	// Format index with leading zero (e.g., 1 -> 01)
	pEM02.Active						:= TRUE;
	pEM02.ID							:= 2;

	// Configuration 
	pEM02.Cfg.IsIndependant				:= FALSE;


	// Set Cfg.IsIndependant PML according to modules configuration
	FOR i:=0 TO MAX_MODULES DO
		pPackML_EM[i].Cfg.IsIndependant	:= pModuleList[i].Cfg.IsIndependant;
	END_FOR


END_ACTION