// Moteur de calcul Logistique & Transports pour Satisfactory 1.2
// Algorithmes de dimensionnement (Train, Drone, Camion, Convoyeur) et Matrice Décisionnelle

class SatisfactoryLogisticsEngine {

  /**
   * Retourne la taille de pile (Stack Size) d'un item donné
   */
  static getItemStackSize(itemId) {
    if (!itemId) return 100;
    const cleanId = itemId.toLowerCase().trim();

    if (LOGISTICS_DATA.stackSizes.fluid.includes(cleanId)) return 2400; // Fluides (m³)
    if (LOGISTICS_DATA.stackSizes[500].includes(cleanId)) return 500;
    if (LOGISTICS_DATA.stackSizes[200].includes(cleanId)) return 200;
    if (LOGISTICS_DATA.stackSizes[50].includes(cleanId)) return 50;
    if (LOGISTICS_DATA.stackSizes[100].includes(cleanId)) return 100;
    
    // Par défaut
    return 100;
  }

  /**
   * Indique si un item est un fluide
   */
  static isItemFluid(itemId) {
    if (!itemId) return false;
    const cleanId = itemId.toLowerCase().trim();
    return LOGISTICS_DATA.stackSizes.fluid.includes(cleanId) || cleanId.includes("water") || cleanId.includes("oil") || cleanId.includes("fuel") || cleanId.includes("acid");
  }

  /**
   * Calcul complet pour une ligne de Train Monorail
   */
  static calculateTrain(distanceM, throughputPerMin, itemId, options = {}) {
    const isFluid = options.isFluid !== undefined ? options.isFluid : this.isItemFluid(itemId);
    const stackSize = options.stackSize || (isFluid ? 2400 : this.getItemStackSize(itemId));
    const slope = options.slope || "flat"; // "flat", "moderate", "steep"
    const isBidirectional = options.isBidirectional || false; // Voie unique va-et-vient (2 locos) vs boucle (1 loco)

    const speedMs = (LOGISTICS_DATA.modes.train.speedKmh * 1000) / 3600; // ~33.33 m/s
    const accelDecelPenaltySec = 15; // Temps perdu en accélération et freinage
    const oneWayTravelSec = (distanceM / speedMs) + accelDecelPenaltySec;
    const dockTimeSec = LOGISTICS_DATA.modes.train.dockTimeSec; // 25s par gare
    const totalDockTimeSec = 2 * dockTimeSec; // 50s total pour 2 gares
    const safetyBufferSec = 10; // Marge de sécurité
    const roundtripTimeSec = Math.max(70, Math.round((oneWayTravelSec * 2) + totalDockTimeSec + safetyBufferSec));

    // Capacité d'un wagon
    const singleCarCapacity = isFluid ? 2400 : (32 * stackSize);
    
    // Débit maximal théorique par wagon sur ce trajet
    const singleCarThroughputPerMin = (singleCarCapacity / (roundtripTimeSec / 60));
    
    // Nombre de wagons nécessaires
    const wagonsRequired = Math.max(1, Math.ceil(throughputPerMin / singleCarThroughputPerMin));
    const totalCapacity = wagonsRequired * singleCarCapacity;
    const maxLineThroughputPerMin = Math.round(wagonsRequired * singleCarThroughputPerMin);
    const saturationPercent = Math.min(100, Math.round((throughputPerMin / maxLineThroughputPerMin) * 100));

    // Locomotives nécessaires
    let wagonsPerLoco = 4;
    if (slope === "moderate") wagonsPerLoco = 3;
    if (slope === "steep") wagonsPerLoco = 2;
    
    let locosRequired = Math.max(1, Math.ceil(wagonsRequired / wagonsPerLoco));
    if (isBidirectional && locosRequired < 2) {
      locosRequired = 2; // Une loco à chaque extrémité pour le va-et-vient
    }

    // Calcul du gel de quai (25s) et dimensionnement du tampon
    const freezeLossItems = Math.ceil(throughputPerMin * (dockTimeSec / 60));
    const requiredBufferBeltSpeed = Math.ceil((throughputPerMin * roundtripTimeSec) / (roundtripTimeSec - totalDockTimeSec));
    const doubleContainerBufferNeeded = throughputPerMin > 480 || freezeLossItems > (stackSize * 2);

    // Puissance électrique
    const stationsPowerMW = 2 * LOGISTICS_DATA.modes.train.station.powerMW; // 100 MW
    const platformsPowerMW = (wagonsRequired * 2) * LOGISTICS_DATA.modes.train.freightPlatform.powerMW;
    const locosPowerAvgMW = locosRequired * LOGISTICS_DATA.modes.train.locomotive.powerAvgMW;
    const locosPowerMaxMW = locosRequired * LOGISTICS_DATA.modes.train.locomotive.powerMaxMW;
    const totalPowerAvgMW = stationsPowerMW + platformsPowerMW + locosPowerAvgMW;
    const totalPowerMaxMW = stationsPowerMW + platformsPowerMW + locosPowerMaxMW;

    // Coût estimé en matériaux
    const trackSegments = Math.ceil(distanceM / 100);
    const estimatedCost = {
      "heavy_modular_frame": (locosRequired * 5) + (wagonsRequired * 3) + (2 * 10) + (wagonsRequired * 2 * 5),
      "motor": (locosRequired * 10) + (2 * 10) + (isFluid ? wagonsRequired * 2 : 0),
      "steel_pipe": (locosRequired * 15) + (wagonsRequired * 20) + (2 * 20) + (trackSegments * 10),
      "steel_beam": (wagonsRequired * 10) + (trackSegments * 10),
      "concrete": (wagonsRequired * 2 * 50)
    };

    return {
      mode: "train",
      isFluid,
      distanceM,
      throughputPerMin,
      roundtripTimeSec,
      roundtripFormatted: `${Math.floor(roundtripTimeSec / 60)}m ${roundtripTimeSec % 60}s`,
      singleCarCapacity,
      wagonsRequired,
      locosRequired,
      trainComposition: `${locosRequired}x Loco + ${wagonsRequired}x ${isFluid ? "Citerne" : "Wagon Fret"}`,
      totalCapacity,
      maxLineThroughputPerMin,
      saturationPercent,
      dockTimeSec,
      freezeLossItems,
      requiredBufferBeltSpeed,
      doubleContainerBufferNeeded,
      totalPowerAvgMW,
      totalPowerMaxMW,
      estimatedCost
    };
  }

  /**
   * Calcul complet pour une flotte de Drones
   */
  static calculateDrone(distanceM, throughputPerMin, itemId, options = {}) {
    const isFluid = options.isFluid !== undefined ? options.isFluid : this.isItemFluid(itemId);
    if (isFluid) {
      // Les drones ne transportent pas de fluides bruts sans emballage
      return {
        mode: "drone",
        isFluid: true,
        error: "Les Drones ne transportent pas de liquides bruts (nécessite d'emballer le fluide en bidons au préalable)."
      };
    }

    const stackSize = options.stackSize || this.getItemStackSize(itemId);
    const cruiseSpeedMs = LOGISTICS_DATA.modes.drone.cruiseSpeedMs; // 70 m/s
    const cruiseTimeOneWaySec = distanceM / cruiseSpeedMs;
    const takeoffLandingSec = LOGISTICS_DATA.modes.drone.takeoffLandingSec; // 40s total
    const roundtripTimeSec = Math.max(60, Math.round((cruiseTimeOneWaySec * 2) + takeoffLandingSec));

    const capacitySlots = LOGISTICS_DATA.modes.drone.capacitySlots; // 9 stacks
    const singleDroneCapacity = capacitySlots * stackSize;
    const singleDroneThroughputPerMin = singleDroneCapacity / (roundtripTimeSec / 60);

    const dronesRequired = Math.max(1, Math.ceil(throughputPerMin / singleDroneThroughputPerMin));
    const portsRequired = Math.max(2, dronesRequired * 2); // 1 port d'envoi et 1 port de réception par drone actif

    // Consommation de batteries
    const batteriesPerTrip = LOGISTICS_DATA.modes.drone.batteryFormula(distanceM);
    const tripsPerMinPerDrone = 60 / roundtripTimeSec;
    const totalTripsPerMin = dronesRequired * tripsPerMinPerDrone;
    const batteriesPerMin = +(totalTripsPerMin * batteriesPerTrip).toFixed(2);
    const batteriesPerHour = Math.round(batteriesPerMin * 60);

    // Puissance électrique
    const totalPowerAvgMW = (portsRequired * LOGISTICS_DATA.modes.drone.port.powerActiveMW);

    const estimatedCost = {
      "heavy_modular_frame": (portsRequired * 20),
      "aluminum_sheet": (portsRequired * 20) + (dronesRequired * 10),
      "motor": (portsRequired * 10) + (dronesRequired * 4),
      "radio_control_unit": (dronesRequired * 1),
      "circuit_board": (portsRequired * 10)
    };

    return {
      mode: "drone",
      isFluid: false,
      distanceM,
      throughputPerMin,
      roundtripTimeSec,
      roundtripFormatted: `${Math.floor(roundtripTimeSec / 60)}m ${roundtripTimeSec % 60}s`,
      singleDroneCapacity,
      dronesRequired,
      portsRequired,
      droneComposition: `${dronesRequired}x Drone(s) (${portsRequired} Ports)`,
      singleDroneThroughputPerMin: Math.round(singleDroneThroughputPerMin),
      maxLineThroughputPerMin: Math.round(dronesRequired * singleDroneThroughputPerMin),
      batteriesPerTrip,
      batteriesPerMin,
      batteriesPerHour,
      totalPowerAvgMW,
      estimatedCost
    };
  }

  /**
   * Calcul complet pour Véhicules Terrestres (Tracteur, Camion, Explorateur)
   */
  static calculateVehicle(distanceM, throughputPerMin, itemId, vehicleType = "truck", fuelId = "fuel", options = {}) {
    const isFluid = options.isFluid !== undefined ? options.isFluid : this.isItemFluid(itemId);
    if (isFluid) {
      return {
        mode: "vehicle",
        vehicleType,
        isFluid: true,
        error: "Les véhicules terrestres ne transportent pas de liquides en vrac (nécessite bidons emballés)."
      };
    }

    const vehicleSpec = LOGISTICS_DATA.modes.vehicles[vehicleType] || LOGISTICS_DATA.modes.vehicles.truck;
    const fuelSpec = LOGISTICS_DATA.fuels.find(f => f.id === fuelId) || LOGISTICS_DATA.fuels[4]; // Fuel standard par défaut
    const stackSize = options.stackSize || this.getItemStackSize(itemId);

    const speedMs = (vehicleSpec.speedKmh * 1000) / 3600;
    const terrainPenaltySec = 20; // Virages et ralentissements naturels
    const oneWayTravelSec = (distanceM / speedMs) + terrainPenaltySec;
    const totalDockTimeSec = 2 * vehicleSpec.dockTimeSec; // 40s
    const roundtripTimeSec = Math.max(50, Math.round((oneWayTravelSec * 2) + totalDockTimeSec));

    const singleCapacity = vehicleSpec.capacitySlots * stackSize;
    const singleThroughputPerMin = singleCapacity / (roundtripTimeSec / 60);
    const vehiclesRequired = Math.max(1, Math.ceil(throughputPerMin / singleThroughputPerMin));

    // Calcul de la consommation de carburant
    // burnRateMW (MW) = MJ/s consommés lorsque le véhicule roule
    const drivingTimeSec = oneWayTravelSec * 2;
    const energyConsumedMJPerTrip = (vehicleSpec.burnRateMW) * (drivingTimeSec / 3); // ~1/3 d'accélération pleine charge
    const fuelUnitsPerTrip = Math.max(0.5, +(energyConsumedMJPerTrip / fuelSpec.energyMJ).toFixed(2));
    const tripsPerMinPerVehicle = 60 / roundtripTimeSec;
    const totalFuelPerMin = +(vehiclesRequired * tripsPerMinPerVehicle * fuelUnitsPerTrip).toFixed(2);
    const totalFuelPerHour = Math.round(totalFuelPerMin * 60);

    // Puissance des 2 gares routières (20 MW chacune)
    const stationsPowerMW = 2 * LOGISTICS_DATA.modes.vehicles.station.powerMW;

    return {
      mode: "vehicle",
      vehicleType,
      vehicleName: vehicleSpec.name,
      icon: vehicleSpec.icon,
      distanceM,
      throughputPerMin,
      roundtripTimeSec,
      roundtripFormatted: `${Math.floor(roundtripTimeSec / 60)}m ${roundtripTimeSec % 60}s`,
      singleCapacity,
      vehiclesRequired,
      composition: `${vehiclesRequired}x ${vehicleSpec.name} (2 Gares)`,
      maxLineThroughputPerMin: Math.round(vehiclesRequired * singleThroughputPerMin),
      fuelName: fuelSpec.name,
      fuelIcon: fuelSpec.icon,
      fuelUnitsPerTrip,
      totalFuelPerMin,
      totalFuelPerHour,
      stationsPowerMW
    };
  }

  /**
   * Calcul pour Convoyeurs / Tuyaux longues distances
   */
  static calculateBeltsAndPipes(distanceM, throughputPerMin, itemId, options = {}) {
    const isFluid = options.isFluid !== undefined ? options.isFluid : this.isItemFluid(itemId);

    if (isFluid) {
      const pipeType = throughputPerMin <= 300 ? "mk1" : "mk2";
      const maxFlow = pipeType === "mk1" ? 300 : 600;
      const pipesRequired = Math.max(1, Math.ceil(throughputPerMin / maxFlow));

      return {
        mode: "pipe",
        isFluid: true,
        distanceM,
        throughputPerMin,
        linesRequired: pipesRequired,
        recommendedTier: pipeType === "mk1" ? "Tuyau Mk.1 (300 m³/min)" : "Tuyau Mk.2 (600 m³/min)",
        powerMW: 0,
        complexityNote: distanceM > 1000 ? "Forte friction & perte de charge sur longue distance (pompes requises si dénivelé)." : "Solution fluide simple et économique."
      };
    } else {
      // Bandes transporteuses
      let tier = "mk1";
      let tierSpeed = 60;
      if (throughputPerMin <= 60) { tier = "mk1"; tierSpeed = 60; }
      else if (throughputPerMin <= 120) { tier = "mk2"; tierSpeed = 120; }
      else if (throughputPerMin <= 270) { tier = "mk3"; tierSpeed = 270; }
      else if (throughputPerMin <= 480) { tier = "mk4"; tierSpeed = 480; }
      else if (throughputPerMin <= 780) { tier = "mk5"; tierSpeed = 780; }
      else { tier = "mk6"; tierSpeed = 1200; }

      const linesRequired = Math.max(1, Math.ceil(throughputPerMin / tierSpeed));

      return {
        mode: "belt",
        isFluid: false,
        distanceM,
        throughputPerMin,
        linesRequired,
        recommendedTier: LOGISTICS_DATA.modes.belts[tier].name,
        powerMW: 0,
        latencySec: Math.round(distanceM / (tierSpeed / 60 * 0.1)), // Latence premier item
        complexityNote: distanceM > 800 ? "Très coûteux en FPS / objets du monde sur longue distance. Encombrement élevé." : "Solution zéro énergie idéale pour courte portée."
      };
    }
  }

  /**
   * Matrice Décisionnelle Comparative FICSIT
   * Évalue tous les modes pour une distance et un débit donnés, et désigne le vainqueur
   */
  static calculateDecisionMatrix(distanceM, throughputPerMin, itemId, options = {}) {
    const isFluid = options.isFluid !== undefined ? options.isFluid : this.isItemFluid(itemId);
    const train = this.calculateTrain(distanceM, throughputPerMin, itemId, options);
    const beltOrPipe = this.calculateBeltsAndPipes(distanceM, throughputPerMin, itemId, options);
    
    let drone = null;
    let truck = null;
    let tractor = null;

    if (!isFluid) {
      drone = this.calculateDrone(distanceM, throughputPerMin, itemId, options);
      truck = this.calculateVehicle(distanceM, throughputPerMin, itemId, "truck", "fuel", options);
      tractor = this.calculateVehicle(distanceM, throughputPerMin, itemId, "tractor", "coal", options);
    }

    // Attribution des scores (0 à 100)
    const evaluations = [];

    // 1. Évaluation Convoyeurs / Tuyaux
    let beltScore = 100;
    if (distanceM <= 300) beltScore = 95;
    else if (distanceM <= 700) beltScore = 75;
    else if (distanceM <= 1200) beltScore = 45;
    else beltScore = 20;

    evaluations.push({
      mode: isFluid ? "pipe" : "belt",
      name: isFluid ? "Tuyaux Longue Portée" : "Convoyeurs Terrestres",
      icon: isFluid ? "🚰" : "📦",
      score: beltScore,
      rating: beltScore >= 80 ? "Recommandé" : beltScore >= 50 ? "Acceptable" : "Déconseillé",
      powerMW: 0,
      setupCost: distanceM < 500 ? "Très Faible" : "Élevé",
      pros: ["0 MW de consommation", "Débit 100% continu sans à-coup", "Zéro gestion de carburant"],
      cons: distanceM > 600 ? ["Impact lourd sur les FPS / Objets Unreal", "Travaux fastidieux de pose", "Non modulable"] : ["Encombrement visuel"]
    });

    // 2. Évaluation Train
    let trainScore = 50;
    if (distanceM >= 1200) trainScore = 95;
    else if (distanceM >= 600) trainScore = 85;
    else if (distanceM >= 300) trainScore = 65;
    else trainScore = 40;

    evaluations.push({
      mode: "train",
      name: "Monorail Ferroviaire FICSIT",
      icon: "🚂",
      score: trainScore,
      rating: trainScore >= 80 ? "Recommandé" : trainScore >= 60 ? "Bon" : "Surdimensionné",
      powerMW: train.totalPowerAvgMW,
      setupCost: "Moyen à Élevé",
      pros: ["Débit massif extensible (ajout de wagons)", "Transporte le réseau électrique 2-en-1", "Fluides & Solides"],
      cons: ["Nécessite la pose de voies ferroviaires", "Temps de gel de quai de 25s (tampons requis)"]
    });

    // 3. Évaluation Drones (si solide)
    if (!isFluid && drone && !drone.error) {
      let droneScore = 30;
      if (distanceM >= 2000 && throughputPerMin <= 200) droneScore = 92;
      else if (distanceM >= 1200 && throughputPerMin <= 300) droneScore = 80;
      else if (throughputPerMin > 600) droneScore = 35; // Trop de batteries
      else if (distanceM < 600) droneScore = 25;

      evaluations.push({
        mode: "drone",
        name: "Flotte de Drones Aériens",
        icon: "🛸",
        score: droneScore,
        rating: droneScore >= 80 ? "Recommandé" : droneScore >= 50 ? "Situationnel" : "Non Rentable",
        powerMW: drone.totalPowerAvgMW,
        setupCost: "Faible (Aucune route à poser)",
        pros: ["Zéro infrastructure entre les gares", "Ignore complètement le relief et les falaises", "Ultra rapide"],
        cons: [`Consomme ${drone.batteriesPerMin} batteries/min`, "Non compatible fluides bruts", "Limité aux faibles cadences"]
      });
    }

    // 4. Évaluation Camions (si solide)
    if (!isFluid && truck && !truck.error) {
      let truckScore = 40;
      if (distanceM >= 400 && distanceM <= 1200 && throughputPerMin <= 400) truckScore = 82;
      else if (distanceM < 400) truckScore = 55;
      else truckScore = 45;

      evaluations.push({
        mode: "truck",
        name: "Réseau Routier Camions",
        icon: "🚛",
        score: truckScore,
        rating: truckScore >= 75 ? "Recommandé" : truckScore >= 50 ? "Acceptable" : "Déconseillé",
        powerMW: truck.stationsPowerMW,
        setupCost: "Faible",
        pros: ["Mise en place rapide en milieu de partie", "Bonne capacité de stockage (48 slots)", "Coût en rails nul"],
        cons: [`Nécessite du carburant (${truck.totalFuelPerMin} ${truck.fuelName}/min)`, "Risque d'accident / perte de trajectoire"]
      });
    }

    // Tri par score décroissant
    evaluations.sort((a, b) => b.score - a.score);

    return {
      winner: evaluations[0],
      evaluations,
      trainDetails: train,
      droneDetails: drone,
      truckDetails: truck,
      beltDetails: beltOrPipe
    };
  }
}
