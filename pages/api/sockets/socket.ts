import { Server } from "socket.io";
import prisma from '@/app/libs/prismadb';

export default function handler(req: any, res: any){
  if(res.socket.server.io){
    console.log("Server alredy started!");
    res.end();
    return;
  }

  let users = [] as any;
  const io = new Server(res.socket.server,  {
    path: 'https://roaring-twilight-b141de.netlify.app/api/socket_io',
    addTrailingSlash: false,
    cors: { 
      origin: "https://roaring-twilight-b141de.netlify.app",
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling'],
  })

  res.socket.server.io = io;
  


  io.on('connection', (socket) => {
    console.log("Connected: ", socket.id);

    // Active Status

    socket.on("user-status", async (obj: any) => {
      await prisma.user.update({
        where: {
          id: obj.id,
        },
        data: {
          isActive: true
        }
      })


      if(!users.some((ven: any) => Object.values(ven).includes(obj.id))){
        users = [...users, {[socket.id]: obj.id}]
      }


      io.emit("receive-status", users);
    })

    // Send Message

    socket.on('send-message', async (obj) => {
      await prisma.message.create({
        data: {
          message: obj.message,
          conversationId: obj.conversationId,
          userId: obj.userId,
          images: obj.images
        }
      })

      io.emit('receive-message', obj)
    })

    // Seen Message 
    socket.on('message-seen', async (obj) => {
      await prisma.message.updateMany({
        where: {
          id: {
            in: obj.messageIds
          },
          seen: false
        },
        data: {
          seen: true
        }
      })

      io.emit('receive-message-seen', obj);
    })

    // Add Comment

    socket.on('add-comment', async (obj) => {
      await prisma.comment.create({
        data: {
          postId: obj.postId,
          userId: obj.user.id,
          content: obj.content,
        }
      })

      await prisma.notification.create({
        data: {
          userId: obj.postUserId,
          senderUserId: obj.user.id,
          link: `/posts/${obj.postId}`,
          content: 'Comment on your post'
        }
      })

      io.emit('receive-notification', {
        userId: obj.postUserId,
        senderUser: obj.user,
        link: `/profile/${obj.postId}`,
        updatedAt: new Date(),
        content: 'Comment on your post'
      })
      
      io.emit('receive-comment', obj)
    })
    

    // Follow 

    socket.on('follow', async (obj) => {
      
      const user = await prisma.user.findUnique({
        where: {
          id: obj.userId
        }
      });

      const current = await prisma.user.findUnique({
        where: {
          id: obj.currentId
        }
      })

      if(!current?.following.some((itm: any) => itm == obj.userId)){
        await prisma.user.update({
          where: {
            id: obj.currentId
          },
          data: {
            following: {
              push: obj.userId
            }
          }
        })
        
      }

      if(!user?.followers.some((itm: any) => itm == obj.currentId)){
        await prisma.user.update({
          where: {
            id: obj.userId
          },
          data: {
            followers: {
              push: obj.currentId
            }
          }
        })
      }


      await prisma.notification.create({
        data: {
          userId: obj.userId,
          senderUserId: obj.currentId,
          link: `/profile/${obj.currentId}`,
          content: 'Started Follow You'
        }
      })

      io.emit('receive-notification', {
        userId: obj.userId,
        senderUser: obj.user,
        link: `/profile/${obj.currentId}`,
        updatedAt: new Date(),
        content: 'Started Follow You'
      })
      io.emit('receive-follow', obj);
    })

    // Like Comment commentId

    socket.on('like-comment', async (obj) => {
      const comment = await prisma.comment.findUnique({
        where: {
          id: obj.commentId
        }
      });

      if(!comment?.likes.some((id: string) => id == obj.userId)){
          await prisma.comment.update({
            where: {
              id: obj.commentId,
            },
            data: {
              likes: {
                push: obj.userId
              }
            }
          })
      }

      if(obj.user.id != obj.idUser){
        await prisma.notification.create({
          data: {
            userId: obj.idUser,
            senderUserId: obj.user.id,
            link: `/posts/${obj.postId}`,
            content: 'Like Your Comment!'
          }
        })
  
        io.emit('receive-notification', {
          userId: obj.idUser,
          senderUser: obj.user,
          link: `/posts/${obj.postId}`,
          updatedAt: new Date(),
          content: 'Like Your Comment!'
        });
      }

      io.emit('receive-like-comment', obj);
    })
  
    socket.on('unLike-comment', async (obj) => {
  
        const comment = await prisma.comment.findUnique({
          where: {
            id: obj.commentId
          }
        });
      
  
        if(comment?.likes.some((id: string) => id == obj.userId)){
          await prisma.comment.update({
            where: {
              id: obj.commentId,
            },
            data: {
              likes: {
                set: comment?.likes.filter((id: any) => id !== obj.userId)
              }
            }
          })
        }

        io.emit('receive-unLike-comment', obj);
    })
    
    // Like Post

    socket.on('like', async (obj) => {
      const post = await prisma.post.findUnique({
        where: {
          id: obj.postId
        }
      });

      if(!post?.likes.some((id: string) => id == obj.userId)){
          await prisma.post.update({
            where: {
              id: obj.postId,
            },
            data: {
              likes: {
                push: obj.userId
              }
            }
          })
      }
      
      if(obj.user.id != obj.idUser){
        await prisma.notification.create({
          data: {
            userId: obj.idUser,
            senderUserId: obj.user.id,
            link: `/posts/${obj.postId}`,
            content: 'Like Your Post!'
          }
        })
  
        io.emit('receive-notification', {
          userId: obj.idUser,
          senderUser: obj.user,
          link: `/posts/${obj.postId}`,
          updatedAt: new Date(),
          content: 'Like Your Post!'
        });
      }

      io.emit('receive-like', obj);
    })
  
    socket.on('unLike', async (obj) => {
  
        const post = await prisma.post.findUnique({
          where: {
            id: obj.postId
          }
        });
      
  
        if(post?.likes.some((id: string) => id == obj.userId)){
          await prisma.post.update({
            where: {
              id: obj.postId,
            },
            data: {
              likes: {
                set: post?.likes.filter((id: any) => id !== obj.userId)
              }
            }
          })
        }

        io.emit('receive-unLike', obj);
    })

    // Follow Back

    socket.on('follow-back', async (obj) => {
      
      const user = await prisma.user.findUnique({
        where: {
          id: obj.userId
        }
      });

      const current = await prisma.user.findUnique({
        where: {
          id: obj.currentId
        }
      })

      if(!current?.following.some((itm: any) => itm == obj.userId)){
        await prisma.user.update({
          where: {
            id: obj.currentId
          },
          data: {
            following: {
              push: obj.userId
            }
          }
        })
        
      }

      if(!user?.followers.some((itm: any) => itm == obj.currentId)){
        await prisma.user.update({
          where: {
            id: obj.userId
          },
          data: {
            followers: {
              push: obj.currentId
            }
          }
        })
      }

      const cons = await prisma.conversation.findMany({
        where: {
            users: {
                hasEvery: [obj.currentId, obj.userId],
            }
        }
      })
    
      if(cons.length <= 0){
        await prisma.conversation.create({
          data: {
            users: [
              obj.userId,
              obj.currentId
            ]
          },
        })
      }
    
      
      await prisma.notification.create({
        data: {
          userId: obj.userId,
          senderUserId: obj.currentId,
          link: `/profile/${obj.currentId}`,
          content: 'Started Follow Back'
        }
      })

      io.emit('receive-notification', {
        userId: obj.userId,
        senderUser: obj.user,
        link: `/profile/${obj.currentId}`,
        updatedAt: new Date(),
        content: 'Started Follow Back'
      });

      io.emit('receive-follow', obj);
    })

    // Unfollow

    socket.on('unFollow', async (obj) => {
      
      const user = await prisma.user.findUnique({
        where: {
          id: obj.userId
        }
      });

      const current = await prisma.user.findUnique({
        where: {
          id: obj.currentId
        }
      })

      if(current?.following.some((itm: any) => itm == obj.userId)){
        await prisma.user.update({
          where: {
            id: obj.currentId
          },
          data: {
            following: {
              set: current?.following.filter((id: any) => id !== obj.userId)
            }
          }
        })
        
      }

      if(user?.followers.some((itm: any) => itm == obj.currentId)){
        await prisma.user.update({
          where: {
            id: obj.userId
          },
          data: {
            followers: {
              set: user?.following.filter((id: any) => id !== obj.currentId)
            }
          }
        })
      }


      io.emit('receive-unFollow', obj);
    })


    //  Disconnect
    socket.on('disconnect', async () => {
      console.log('🔥: A user disconnected');
      const activeOffId = users.filter((usr: any) => Object.keys(usr) as any == socket.id)
      await prisma.user.update({
        where: {
          id: activeOffId[0][socket.id]
        },
        data: {
          isActive: false
        }
      })

      users = users.filter((usr: any) => Object.keys(usr) as any != socket.id)
      io.emit("receive-status", users);
      socket.disconnect();
    });
  });

  console.log("Socket server started successfully!");
  res.end();
}

