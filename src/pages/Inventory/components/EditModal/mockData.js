export const skus = [
  {
    id: '16',
    node: {
      identifier: 'test2',
      name: 'test2',
      token: 'HXAl2sDCAYyR',
      hardwareSku: {
        id: '1',
        price: 1400,
        memory: 16,
        ssdStorage: 256,
        hddStorage: 512,
        cpuBaseClock: 2.1,
        cpuThreadCount: 4,
        gpu: {
          id: '2',
          name: 'RTX3080',
        },
        numGpu: 2,
        hardwarePartner: {
          id: '2',
          name: 'MORLEY CORP',
          contactInfo: '(978)-727-3060',
        },
        identifier: 'ACME-1234',
        capabilities: [
          {
            hardwareSku: {
              id: '1',
            },
            siteType: {
              id: '1',
              name: 'Corporate',
            },
            numStreams: 25,
            numViewers: 25,
            fullDaysRetention: 30,
            motionDaysRetention: 15,
          },
          {
            hardwareSku: {
              id: '1',
            },
            siteType: {
              id: '2',
              name: 'Residential',
            },
            numStreams: 100,
            numViewers: 100,
            fullDaysRetention: 30,
            motionDaysRetention: 10,
          },
        ],
      },
      retentionMotionDays: 7,
      retentionNonmotionDays: 4,
    },
    status: 1,
    shippingInfo: null,
    comment: null,
    shippingTrackingLink: null,
    provisioningKey: 'REyITb0X',
    transitions: [
      "{'id': 1, 'name': 'NEW'}",
      "{'id': 2, 'name': 'PENDING_BUILD'}",
      "{'id': 3, 'name': 'PENDING_INSTALLATION'}",
      "{'id': 4, 'name': 'READY_TO_SHIP'}",
      "{'id': 5, 'name': 'SHIPPED'}",
      "{'id': 6, 'name': 'DELIVERED'}",
      "{'id': 7, 'name': 'ONLINE'}",
      "{'id': 8, 'name': 'PROVISIONED'}",
      "{'id': 9, 'name': 'BLOCKED'}",
    ],
    welcomeUser: null,
  },
]
//
// export const skus = [
//   {
//     node: {
//       hardwarePartner: {
//         name: 'Velasea',
//         contactInfo: '415-334-1234'
//       },
//     identifier: 'AMB-2246G-4000',
//     price: 3550,
//     memory: 64, // ram in gb
//     ssdStorage: 256, // gb
//     hddStorage: 8000, // gb
//     gpu: {
//         name: 'RTX4000'
//     },
//     numGpu: 8,
//     hardwareInfo: 'good',
//     cpuBaseClock: 3.6, // Ghz
//     cpuThreadCount: 16,
//     capacities: [
//       {
//         siteType: {
//           id: 1,
//           name: 'corporate',
//         },
//         numStreams: 50,
//         numViewers: 30,
//         fullDaysRetention: 30,
//         motionDaysRetention: 30,
//       },
//       {
//         siteType: {
//           id: 1,
//           name: 'museum',
//         },
//         numStreams: 100,
//         numViewers: 30,
//         fullDaysRetention: 30,
//         motionDaysRetention: 30,
//       },
//       {
//         siteType: {
//           id: 1,
//           name: 'school',
//         },
//         numStreams: 150,
//         numViewers: 30,
//         fullDaysRetention: 30,
//         motionDaysRetention: 30,
//       },
//       {
//         siteType: {
//           id: 1,
//           name: 'residential',
//         },
//         numStreams: 200,
//         numViewers: 30,
//         fullDaysRetention: 30,
//         motionDaysRetention: 30,
//       }
//     ],
//   },
// {
//   hardwarePartner: {
//     name: 'Velasea',
//     contactInfo: '415-334-1234'
//   },
//   identifier: 'AMB-9900k-4000',
//   price: 4100,
//   memory: 64, // ram in gb
//   ssdStorage: 512, // gb
//   hddStorage: 16000, // gb
//   gpu: {
//       name: 'RTX4000'
//   },
//   numGpu: 8,
//   hardwareInfo: 'good',
//   cpuBaseClock: 3.6, // Ghz
//   cpuThreadCount: 16,
//   capacities: [
//     {
//       siteType: {
//         id: 1,
//         name: 'corporate',
//       },
//       numStreams: 50,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'museum',
//       },
//       numStreams: 100,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'school',
//       },
//       numStreams: 150,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'residential',
//       },
//       numStreams: 200,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     }
//   ],
// },
// {
//   hardwarePartner: {
//     name: 'Velasea',
//     contactInfo: '415-334-1234'
//   },
//   identifier: 'VEL-AMB-50S-30D',
//   price: 12234,
//   memory: 128, // ram in gb
//   ssdStorage: 480, // gb
//   hddStorage: 24000, // gb
//   gpu: {
//       name: '2 x RTX 5000'
//   },
//   numGpu: 16,
//   hardwareInfo: 'good',
//   cpuBaseClock: 3.6, // Ghz
//   cpuThreadCount: 16,
//   capacities: [
//     {
//       siteType: {
//         id: 1,
//         name: 'corporate',
//       },
//       numStreams: 50,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'museum',
//       },
//       numStreams: 100,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'school',
//       },
//       numStreams: 150,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'residential',
//       },
//       numStreams: 200,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     }
//   ],
// },
// {
//   hardwarePartner: {
//     name: 'Velasea',
//     contactInfo: '415-334-1234'
//   },
//   identifier: 'VEL-AMB-80S-30D',
//   price: 16889,
//   memory: 192, // ram in gb
//   ssdStorage: 480, // gb
//   hddStorage: 24000, // gb
//   gpu: {
//       name: '2 x RTX 6000'
//   },
//   numGpu: 16,
//   hardwareInfo: 'good',
//   cpuBaseClock: 3.6, // Ghz
//   cpuThreadCount: 16,
//   capacities: [
//     {
//       siteType: {
//         id: 1,
//         name: 'corporate',
//       },
//       numStreams: 50,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'museum',
//       },
//       numStreams: 100,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'school',
//       },
//       numStreams: 150,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'residential',
//       },
//       numStreams: 200,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     }
//   ],
// },
// {
//   hardwarePartner: {
//     name: 'Velasea',
//     contactInfo: '415-334-1234'
//   },
//   identifier: 'AMB-7426R-48-36K',
//   price: 25619,
//   memory: 256, // ram in gb
//   ssdStorage: 960, // gb
//   hddStorage: 96000, // gb
//   gpu: {
//       name: '3 x  RTX6000'
//   },
//   numGpu: 16,
//   hardwareInfo: 'good',
//   cpuBaseClock: 3.6, // Ghz
//   cpuThreadCount: 16,
//   capacities: [
//     {
//       siteType: {
//         id: 1,
//         name: 'corporate',
//       },
//       numStreams: 50,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'museum',
//       },
//       numStreams: 100,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'school',
//       },
//       numStreams: 150,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'residential',
//       },
//       numStreams: 200,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     }
//   ],
// },
// {
//   hardwarePartner: {
//     name: 'Velasea',
//     contactInfo: '415-334-1234'
//   },
//   identifier: 'VEL-AMB-120S-30D',
//   price: 22937,
//   memory: 192, // ram in gb
//   ssdStorage: 480, // gb
//   hddStorage: 24000, // gb
//   gpu: {
//       name: '3 x RTX6000'
//   },
//   numGpu: 16,
//   hardwareInfo: 'good',
//   cpuBaseClock: 3.6, // Ghz
//   cpuThreadCount: 16,
//   capacities: [
//     {
//       siteType: {
//         id: 1,
//         name: 'corporate',
//       },
//       numStreams: 50,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'museum',
//       },
//       numStreams: 100,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'school',
//       },
//       numStreams: 150,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     },
//     {
//       siteType: {
//         id: 1,
//         name: 'residential',
//       },
//       numStreams: 200,
//       numViewers: 30,
//       fullDaysRetention: 30,
//       motionDaysRetention: 30,
//     }
//   ],
// }
// ]

export const vendors = new Set(
  skus.map(s => s.node.hardwareSku.hardwarePartner.name),
)

export const partnerOptions = Array.from(vendors).map(v => ({
  label: v,
  value: v,
}))

export const skuOptionsForPartner = name => {
  return skus
    .filter(s => s.node.hardwareSku.hardwarePartner.name === name)
    .map(s => ({
      label: s.identifier,
      value: s.identifier,
    }))
}
