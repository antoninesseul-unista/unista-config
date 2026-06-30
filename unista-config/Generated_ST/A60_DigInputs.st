ACTION A60_DigInputs: 

	pConfiguratorDate.DI					  := '30/06/2026 15:25:21';
	// --------------------------------------------------------------------------------------------------------------- //
	// DI 1 : DI1
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pDigInputList[1].Active                             := TRUE;
	pDigInputList[1].Enable                             := TRUE;
	pDigInputList[1].ID                                 := 1;
	pDigInputList[1].ID_EM                              := 1;

	// Configuration
	pDigInputList[1].Cfg.Task                           := 4;
	pDigInputList[1].Cfg.ActivityLevel                  := FALSE;
	pDigInputList[1].Cfg.ForceAllowed                   := FALSE;
	// --------------------------------------------------------------------------------------------------------------- //
	// DI 2 : DI2
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pDigInputList[2].Active                             := TRUE;
	pDigInputList[2].Enable                             := TRUE;
	pDigInputList[2].ID                                 := 2;
	pDigInputList[2].ID_EM                              := 1;

	// Configuration
	pDigInputList[2].Cfg.Task                           := 4;
	pDigInputList[2].Cfg.ActivityLevel                  := TRUE;
	pDigInputList[2].Cfg.ForceAllowed                   := FALSE;

END_ACTION