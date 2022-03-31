// Assumes disk_space_obj prop to come from systemHealth API
/* SystemHealth API call returns object with top-level key of "node_details", among others ("notifications", "site_uptime", "sites").
    Node details is an object with information about all appliances for an account.
    example = {
        node1: {
            disk_space: {
                free: [{1551920153, "1321432143"}, ...]
                percentage: [{1551920153, '95'}, ...]
                total: [{1551920153, '1324213443'}, ...]
            }
        }
    }
*/
const calculateStorage = diskSpace => {
  const freeGB = (
    Number(diskSpace.free[diskSpace.free.length - 1][1]) / 1000000000
  ).toFixed(0)
  const totalGB = (
    Number(diskSpace.total[diskSpace.total.length - 1][1]) / 1000000000
  ).toFixed(0)
  const percentageGB = Number(
    diskSpace.percentage[diskSpace.percentage.length - 1][1],
  ).toFixed(0)

  return {
    free: freeGB,
    used: totalGB - freeGB,
    total: totalGB,
    percentage: percentageGB,
  }
}

export default calculateStorage
