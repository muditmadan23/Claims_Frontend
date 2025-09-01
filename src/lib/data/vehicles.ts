export type Vehicle = {
  id: string;
  image: string;
  name: string;
  make: string;
  model: string;
  year: string;
  license: string;
  vin: string;
  policy: string;
  status: "Active" | "Claim in Progress";
};

export const vehicles: Vehicle[] = [
  {
    id: "camry-2020",
    image: "/camry.png",
    name: "2020 Toyota Camry",
    make: "Toyota",
    model: "Camry",
    year: "2020",
    license: "ABC 123",
    vin: "1234XXXXXXXXDEF",
    policy: "POL1234567",
    status: "Active",
  },
  {
    id: "crv-2022",
    image: "/crv.png",
    name: "2022 Honda CR-V",
    make: "Honda",
    model: "CR-V",
    year: "2022",
    license: "XYZ 789",
    vin: "FECXXXXXXX4321",
    policy: "POL7654321",
    status: "Claim in Progress",
  },
  {
    id: "f150-2019",
    image: "/f150.png",
    name: "2019 Ford F-150",
    make: "Ford",
    model: "F-150",
    year: "2019",
    license: "LMN 456",
    vin: "0987XXXXXXXDEF",
    policy: "POL2468101",
    status: "Active",
  },
];
