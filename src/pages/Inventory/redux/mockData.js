import { InventoryStatusEnum } from 'enums'

export const INVENTORY = [
  {
    id: '16',
    node: {
      identifier: 'test2',
      hardwareSerialNumber: 'sn-12345',
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
    shippingInfo: 'Palo alto',
    comment: "It's ready to ship",
    shippingTrackingLink: 'http://www.espn.com',
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
