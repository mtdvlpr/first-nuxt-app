import * as constants from './../constants/index'

export default (_ctx: any, inject: (arg0: string, arg1: any) => void) => {
  inject('constants', constants)
}
