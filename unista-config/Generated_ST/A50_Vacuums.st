ACTION A50_Vacuums: 

	pConfiguratorDate.VA := '01/07/2026 17:16:27';
	// --------------------------------------------------------------------------------------------------------------- //
	// VA 1 : VAC1
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pVacuumList[1].Active                              := TRUE;
	pVacuumList[1].Enable                              := TRUE;
	pVacuumList[1].ID                                  := 1;
	pVacuumList[1].ID_EM                               := 1;
	
	// Configuration
	pVacuumList[1].Cfg.Task                            := 4;
	pVacuumList[1].Cfg.VenturiType                     := <no value>;
	pVacuumList[1].Cfg.Sensor                          := <no value>;
	// --------------------------------------------------------------------------------------------------------------- //
	// VA 2 : VAC2
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pVacuumList[2].Active                              := TRUE;
	pVacuumList[2].Enable                              := TRUE;
	pVacuumList[2].ID                                  := 2;
	pVacuumList[2].ID_EM                               := 2;
	
	// Configuration
	pVacuumList[2].Cfg.Task                            := 4;
	pVacuumList[2].Cfg.VenturiType                     := <no value>;
	pVacuumList[2].Cfg.Sensor                          := <no value>;

END_ACTION