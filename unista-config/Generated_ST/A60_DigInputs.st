ACTION A60_DigInputs: 

	pConfiguratorDate.DI					  := '01/07/2026 17:16:27';
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
	pDigInputList[2].Cfg.ActivityLevel                  := FALSE;
	// --------------------------------------------------------------------------------------------------------------- //
	// DI 3 : DI3
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pDigInputList[3].Active                             := TRUE;
	pDigInputList[3].Enable                             := TRUE;
	pDigInputList[3].ID                                 := 3;
	pDigInputList[3].ID_EM                              := 1;

	// Configuration
	pDigInputList[3].Cfg.Task                           := 4;
	pDigInputList[3].Cfg.ActivityLevel                  := FALSE;

END_ACTION