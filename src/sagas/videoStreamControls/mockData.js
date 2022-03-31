const mockedGqlResponse = {
  data: {
    forensicsResultsBySite: {
      ok: true,
      searchType: 'THREAT_SIGNATURE',
      instances: [
        {
          stream: {
            id: 3330,
            name: 'Immortal Ben',
            node: {
              identifier: 'host8',
              site: {
                name: 'host8',
                slug: 'host8',
                __typename: 'SiteNode',
              },
              __typename: 'NodeType',
            },
            region: {
              id: 23,
              name: 'Lobby / Reception',
              __typename: 'RegionType',
            },
            __typename: 'StreamType',
          },
          ts: '1599254367275',
          snapshotUrl:
            'https://decider.com/wp-content/uploads/2016/02/theo-von-no-offense-lead.png',
          __typename: 'ElasticsearchMetadataV2Type',
        },
        {
          stream: {
            id: 3332,
            name: 'Immortal Ben',
            node: {
              identifier: 'host8',
              site: {
                name: 'host8',
                slug: 'host8',
                __typename: 'SiteNode',
              },
              __typename: 'NodeType',
            },
            region: {
              id: 23,
              name: 'Lobby / Reception',
              __typename: 'RegionType',
            },
            __typename: 'StreamType',
          },
          ts: '1599254367277',
          snapshotUrl:
            'https://decider.com/wp-content/uploads/2016/02/theo-von-no-offense-lead.png',
          __typename: 'ElasticsearchMetadataV2Type',
        },
        {
          stream: {
            id: 3330,
            name: 'Immortal Ben',
            node: {
              identifier: 'host8',
              site: {
                name: 'host8',
                slug: 'host8',
                __typename: 'SiteNode',
              },
              __typename: 'NodeType',
            },
            region: {
              id: 23,
              name: 'Lobby / Reception',
              __typename: 'RegionType',
            },
            __typename: 'StreamType',
          },
          ts: '1599341658118',
          snapshotUrl:
            'https://decider.com/wp-content/uploads/2016/02/theo-von-no-offense-lead.png',
          __typename: 'ElasticsearchMetadataV2Type',
        },
        {
          stream: {
            id: 3331,
            name: 'Immortal Ben',
            node: {
              identifier: 'host8',
              site: {
                name: 'host8',
                slug: 'host8',
                __typename: 'SiteNode',
              },
              __typename: 'NodeType',
            },
            region: {
              id: 23,
              name: 'Lobby / Reception',
              __typename: 'RegionType',
            },
            __typename: 'StreamType',
          },
          ts: '1599341658158',
          snapshotUrl:
            'https://decider.com/wp-content/uploads/2016/02/theo-von-no-offense-lead.png',
          __typename: 'ElasticsearchMetadataV2Type',
        },
        {
          stream: {
            id: 3329,
            name: 'Immortal Ben',
            node: {
              identifier: 'host8',
              site: {
                name: 'host8',
                slug: 'host8',
                __typename: 'SiteNode',
              },
              __typename: 'NodeType',
            },
            region: {
              id: 23,
              name: 'Lobby / Reception',
              __typename: 'RegionType',
            },
            __typename: 'StreamType',
          },
          ts: '1599341658645',
          snapshotUrl:
            'https://decider.com/wp-content/uploads/2016/02/theo-von-no-offense-lead.png',
          __typename: 'ElasticsearchMetadataV2Type',
        },
      ],
      pages: 1,
      currentPage: 1,
      totalCount: 5,
      __typename: 'MetadataResultV2Type',
    },
  },
}

export default mockedGqlResponse
