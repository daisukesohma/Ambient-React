/* eslint-disable */
const ws_mock = {
  type: 'packet',
  site_id: 'ALL_SITES',
  data: {
    '1': { status: 'healthy' },
    '2': {
      status: 'Stale Ping',
      ping: { ts: 1562321246.51179, value: 0.0002799034118652344 },
      motion_fps: { ts: 1562321249.757366, value: 0.05587034141219747 },
      device_out_fps: { ts: 1562321249.757366, value: 6.061359548224729 },
      fps: { ts: 1562321249.98998, value: 30 },
      engine_out_fps: { ts: 1562321249.757366, value: 17.664096363338192 },
      engine_in_fps: { ts: 1562321249.757366, value: 17.664105290315103 },
    },
    '3': {
      status: 'Stale Ping',
      ping: { ts: 1562321246.512654, value: 0.00035691261291503906 },
      motion_fps: { ts: 1562321249.757366, value: 0.16972433280620308 },
      device_out_fps: { ts: 1562321249.757366, value: 6.001591179233344 },
      fps: { ts: 1562321249.922529, value: 30 },
      engine_out_fps: { ts: 1562321249.757366, value: 17.437849630775933 },
      engine_in_fps: { ts: 1562321249.757366, value: 17.437631414563775 },
    },
    '289': {
      status: 'Healthy',
      ping: { ts: 1562321246.513421, value: 0.00032806396484375 },
      motion_fps: { ts: 1562321249.757366, value: 0.16953234798021105 },
      device_out_fps: { ts: 1562321249.757366, value: 6.063439333094302 },
      fps: { ts: 1562321249.955527, value: 30 },
      engine_out_fps: { ts: 1562321249.757366, value: 17.62408945127631 },
      engine_in_fps: { ts: 1562321249.757366, value: 17.624384194485145 },
    },
    '290': {
      status: 'Healthy',
      ping: { ts: 1562321246.514434, value: 0.0005731582641601562 },
      motion_fps: { ts: 1562321249.757366, value: 5.669326299012227 },
      device_out_fps: { ts: 1562321249.757366, value: 6.426425852204266 },
      fps: { ts: 1562321249.953564, value: 30 },
      engine_out_fps: { ts: 1562321249.757366, value: 15.925247733749764 },
      engine_in_fps: { ts: 1562321249.757366, value: 15.926338618249146 },
    },
    '291': {
      status: 'Stale Ping',
      ping: { ts: 1562321246.50936, value: 0.0006101131439208984 },
      motion_fps: { ts: 1562321249.856199, value: 4.857126638116305 },
      device_out_fps: { ts: 1562321249.856199, value: 5.929932589583667 },
      fps: { ts: 1562321249.883405, value: 30 },
      engine_out_fps: { ts: 1562321249.856199, value: 17.742239844921897 },
      engine_in_fps: { ts: 1562321249.856199, value: 17.74232465305567 },
    },
    '341': {
      status: 'Stale Ping',
      ping: { ts: 1562321246.510207, value: 0.0003349781036376953 },
      motion_fps: { ts: 1562321249.856199, value: 0.10853886085188076 },
      device_out_fps: { ts: 1562321249.856199, value: 6.065946258801601 },
      fps: { ts: 1562321249.995093, value: 13 },
      engine_in_fps: { ts: 1562321249.856199, value: 15.882436982932843 },
      engine_out_fps: { ts: 1562321249.856199, value: 15.899970128115509 },
    },
    '342': { status: 'Unreachable' },
    '343': {
      status: 'Stale Ping',
      ping: { ts: 1562321246.510982, value: 0.0002841949462890625 },
      motion_fps: { ts: 1562321249.689395, value: 0.0488281243065103 },
      device_out_fps: { ts: 1562321249.689395, value: 4.055718751861698 },
      fps: { ts: 1562321249.944825, value: 3 },
      engine_out_fps: { ts: 1562321249.689395, value: 12.359500434201333 },
      engine_in_fps: { ts: 1562321249.689395, value: 12.359521557934137 },
    },
    '348': {
      status: 'Stale Ping',
      ping: { ts: 1562321246.515602, value: 0.0006330013275146484 },
      motion_fps: { ts: 1562321249.827213, value: 0.05124092675745377 },
      device_out_fps: { ts: 1562321249.827213, value: 6.0482888123433485 },
      fps: { ts: 1562321249.997342, value: 20 },
      engine_in_fps: { ts: 1562321249.827213, value: 16.112540202560748 },
      engine_out_fps: { ts: 1562321249.827213, value: 16.11276365306963 },
    },
    '349': {
      status: 'Stale Ping',
      ping: { ts: 1562321246.516457, value: 0.00037384033203125 },
      motion_fps: { ts: 1562321249.827213, value: 0.03131906445937846 },
      device_out_fps: { ts: 1562321249.827213, value: 2.9222514503600228 },
      fps: { ts: 1562321249.777768, value: 3 },
      engine_in_fps: { ts: 1562321249.827213, value: 7.752981372751262 },
      engine_out_fps: { ts: 1562321249.827213, value: 7.752990258003551 },
    },
    '3333': {
      status: 'Healthy',
      ping: { ts: 1572059513.718937, value: 0.00016808509826660156 },
      motion_fps: { ts: 1572059515.221435, value: 2.6331229195387196 },
      device_out_fps: { ts: 1572059515.221435, value: 6.075805931500789 },
      fps: { ts: 1572059515.859068, value: 29 },
      engine_in_fps: { ts: 1572059515.221435, value: 7.817267961853454 },
      engine_out_fps: { ts: 1572059515.221435, value: 7.817268398943959 },
    },
    '5': {
      status: 'Healthy',
      ping: { ts: 1572059513.718136, value: 0.0001938343048095703 },
      motion_fps: { ts: 1572059515.33987, value: 2.7094935095634862 },
      device_out_fps: { ts: 1572059515.33987, value: 6.062475891516489 },
      fps: { ts: 1572059515.801029, value: 29 },
      engine_out_fps: { ts: 1572059515.33987, value: 8.076253407608426 },
      engine_in_fps: { ts: 1572059515.33987, value: 8.07628077756508 },
    },
    '3331': {
      status: 'Healthy',
      ping: { ts: 1572059513.717232, value: 0.00018095970153808594 },
      motion_fps: { ts: 1572059515.416788, value: 2.5891519482647647 },
      device_out_fps: { ts: 1572059515.416788, value: 6.06157144836229 },
      fps: { ts: 1572059515.831136, value: 29 },
      engine_out_fps: { ts: 1572059515.416788, value: 7.931575247011233 },
      engine_in_fps: { ts: 1572059515.416788, value: 7.931582746461128 },
    },
    '3330': {
      status: 'Healthy',
      ping: { ts: 1572059513.716329, value: 0.0001881122589111328 },
      motion_fps: { ts: 1572059515.170237, value: 2.5776173475110613 },
      device_out_fps: { ts: 1572059515.170237, value: 6.062598660051773 },
      fps: { ts: 1572059515.780839, value: 29 },
      engine_out_fps: { ts: 1572059515.170237, value: 7.7884579371214695 },
      engine_in_fps: { ts: 1572059515.170237, value: 7.788438557433928 },
    },
    '3337': {
      status: 'Healthy',
      ping: { ts: 1572059513.721845, value: 0.0001690387725830078 },
      motion_fps: { ts: 1572059515.416788, value: 2.5890648764360504 },
      device_out_fps: { ts: 1572059515.416788, value: 6.070809836401796 },
      fps: { ts: 1572059515.778651, value: 29 },
      engine_in_fps: { ts: 1572059515.416788, value: 7.931615594218759 },
      engine_out_fps: { ts: 1572059515.416788, value: 7.931594145652129 },
    },
    '3336': {
      status: 'Healthy',
      ping: { ts: 1572059513.721119, value: 0.00016689300537109375 },
      motion_fps: { ts: 1572059515.33987, value: 2.7097591284661124 },
      device_out_fps: { ts: 1572059515.33987, value: 6.068575020424614 },
      fps: { ts: 1572059515.78122, value: 29 },
      engine_out_fps: { ts: 1572059515.33987, value: 8.076447800525196 },
      engine_in_fps: { ts: 1572059515.33987, value: 8.076444534646908 },
    },
    '3335': {
      status: 'Healthy',
      ping: { ts: 1572059513.720416, value: 0.00016689300537109375 },
      motion_fps: { ts: 1572059515.33987, value: 2.7097727836723124 },
      device_out_fps: { ts: 1572059515.33987, value: 6.072660120560641 },
      fps: { ts: 1572059515.86447, value: 29 },
      engine_out_fps: { ts: 1572059515.33987, value: 8.076362888548108 },
      engine_in_fps: { ts: 1572059515.33987, value: 8.076356978989784 },
    },
    '3334': {
      status: 'Healthy',
      ping: { ts: 1572059513.719668, value: 0.00016689300537109375 },
      motion_fps: { ts: 1572059515.221435, value: 2.6331326228969205 },
      device_out_fps: { ts: 1572059515.221435, value: 6.074981975528432 },
      fps: { ts: 1572059515.854465, value: 29 },
      engine_in_fps: { ts: 1572059515.221435, value: 7.817330320592804 },
      engine_out_fps: { ts: 1572059515.221435, value: 7.817330757690282 },
    },
    '3339': {
      status: 'Healthy',
      ping: { ts: 1572059513.723249, value: 0.000164031982421875 },
      motion_fps: { ts: 1572059515.416788, value: 2.5890652759813606 },
      device_out_fps: { ts: 1572059515.416788, value: 6.057492150093834 },
      fps: { ts: 1572059515.864393, value: 29 },
      engine_out_fps: { ts: 1572059515.416788, value: 7.931554548603111 },
      engine_in_fps: { ts: 1572059515.416788, value: 7.931571497291604 },
    },
    '8': {
      status: 'Healthy',
      ping: { ts: 1572059513.722553, value: 0.000164031982421875 },
      motion_fps: { ts: 1572059515.170237, value: 2.5776295766632016 },
      device_out_fps: { ts: 1572059515.170237, value: 6.047600131786025 },
      fps: { ts: 1572059515.796444, value: 29 },
      engine_out_fps: { ts: 1572059515.170237, value: 7.788600539877651 },
      engine_in_fps: { ts: 1572059515.170237, value: 7.788596924124583 },
    },
    '2318': { status: 'Unreachable' },
  },
}

export default ws_mock