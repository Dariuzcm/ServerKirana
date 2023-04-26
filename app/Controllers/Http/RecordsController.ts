import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Record from 'App/Models/Record'

export default class RecordsController {
  public async saveRecords({ request, response }: HttpContextContract) {
    const { records } = request.body()

    const newRecords: Record[] = []
    for (const newer of records as Record[]) {
      const finded = await Record.query()
        .from('records')
        .where('name', newer.name)
        .andWhere('email', newer.email || '')
        .andWhere('phone', newer.phone)
      if (finded.length == 0) {
        newRecords.push(newer)
      }
    }

    try {
      let query = "INSERT INTO `karinalabs`.`records` (`name`,`email`,`phone`,`created_at`) VALUES "
      let values = ""
      for (const rec of newRecords) {
        values = values.concat("(", 
              rec.name? `"${rec.name}"` : 'null', 
              ",", 
              rec.email ? `'${rec.email}'` : 'null', 
              ", ", 
              rec.phone ? `'${rec.phone}'` : 'null', 
              ", ", `'${Date.now()}'`, "),")
      }
      values = values.substring(0, values.length - 1);
      query = query.concat(values, ';');

      await Database.rawQuery(query);
      return response.ok({
        created: newRecords,
        numCreated: newRecords.length
      })
    } catch (error) {
      return response.badRequest({
        message: 'Something happend trying to save record',
        error,
      })
    }
  }

  public async getAll() {
    return await Record.all()
  }

  public async getById({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const rec = Record.find(id)

    if (!rec) {
      return response.notFound({ message: `Not finded record id ${id}` })
    }
    return rec
  }

  public async delete({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const rec = await Record.find(id)
    if (!rec)
      return response.notFound({ message: `Not finded record id ${id}` })

    await rec.delete();
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const { record } = request.body()
    try {
      const rec = await Record.find(id)
      if (!rec) {
        return response.notFound({ message: `Not finded record id ${id}` })
      }

      rec.merge({ ...record });
      await rec.save()

    } catch (error) {
      return response.badRequest({
        message: 'Something happend trying to updating record',
        error,
        record
      })
    }
  }

}
