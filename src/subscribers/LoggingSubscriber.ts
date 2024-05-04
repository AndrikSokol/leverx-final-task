// import { Action } from '@/enum/action';
// import { LogService } from '@/log/log.service';
// import {
//   EventSubscriber,
//   EntitySubscriberInterface,
//   InsertEvent,
//   UpdateEvent,
//   RemoveEvent,
//   DataSource,
//   QueryRunner,
// } from 'typeorm';

// @EventSubscriber()
// export class LoggingSubscriber implements EntitySubscriberInterface {
//   constructor(
//     dataSource: DataSource,
//     private readonly logService: LogService,
//   ) {
//     dataSource.subscribers.push(this);
//   }

//   async afterInsert(event: InsertEvent<any>) {
//     const query = '';
//     console.log(query);
//     console.log(
//       `Entity ${event.metadata.givenTableName} created with ID ${event.entityId}`,
//     );
//     await this.logService.createLog(
//       Action.Create,
//       event.metadata.givenTableName,
//       Number(event.entityId),
//       query,
//     );
//   }

//   afterUpdate(event: UpdateEvent<any>) {
//     console.log(
//       `Entity ${event.metadata.givenTableName} updated with ID ${event.entity}`,
//     );
//   }

//   afterRemove(event: RemoveEvent<any>) {
//     // console.log(event.databaseEntity);
//     console.log('\n\n\n\n');
//     console.log(
//       `Entity ${event.metadata.givenTableName} deleted with ID ${event.entityId}`,
//     );
//   }

//   //   constructor(private readonly logService: LogService) {}

//   //   async afterInsert(event: InsertEvent<any>) {
//   //     await this.logService.createLog(
//   //       'create',
//   //       { name: 'dsa' },
//   //       event.entity.constructor.name,
//   //       event.entityId,
//   //     );
//   //   }

//   //   async afterUpdate(event: UpdateEvent<any>) {
//   //     await this.logService.createLog(
//   //       'update',
//   //       this.userId,
//   //       event.entity.constructor.name,
//   //       event.entity,
//   //     );
//   //   }

//   //   async afterRemove(event: RemoveEvent<any>) {
//   //     await this.logService.createLog(
//   //       'delete',
//   //       this.userId,
//   //       event.entity.constructor.name,
//   //       event.entityId,
//   //     );
//   //   }
// }
