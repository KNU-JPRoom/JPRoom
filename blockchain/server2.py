import socketserver
import threading
import pickle
import sys
import json
import blockchain
from json import loads

HOST = '127.0.0.1'
PORT = 7777
#q = queue.Queue()                #연속적으로 들어올 condata를 저정하기위한 큐
contractData = {}

contractData['1'] = '{"transaction": "sena->russian", "amount": 30}'

lock = threading.Lock() # syncronized 동기화 진행하는 스레드 생성

class UserManager: # 사용자관리 및 채팅 메세지 전송을 담당하는 클래스
                   #  채팅 서버로 입장한 사용자의 등록
                   #  채팅을 종료하는 사용자의 퇴장 관리
                   #  사용자가 입장하고 퇴장하는 관리
                   #  사용자가 입력한 메세지를 채팅 서버에 접속한 모두에게 전송(broadcast)

   def __init__(self):
       self.users = {} # 사용자의 등록 정보를 담을 사전 {사용자 이름:(소켓,주소),...}
       self.readyState = {} #각 client의 준비상태를 저장하는 dictionnary {사용자이름:(state)}

   def addUser(self, username, conn, addr): # 사용자 ID를 self.users에 추가하는 함수
      if username in self.users: # 이미 등록된 사용자라면
         conn.send('이미 등록된 노드입니다.\n'.encode())
         return None

      # 새로운 사용자를 등록함
      lock.acquire() # 스레드 동기화를 막기위한 락
      self.users[username] = (conn, addr)
      lock.release() # 업데이트 후 락 해제

      self.sendMessageToAll('[%s]님이 입장했습니다.' %username)
      print('+++ 노드 참여자 수 [%d]' %len(self.users))

      return username

   def setUserState(self, username, state):
       lock.acquire()
       self.readyState[username] = (state)
       lock.release()

       print('set state about [%s]' %username)
       return

   def removeUser(self, username): #사용자를 제거하는 함수
      if username not in self.users:
         return

      lock.acquire()
      del self.users[username]
      lock.release()

      self.sendMessageToAll('[%s]님이 퇴장했습니다.' %username)
      print('--- 노드 참여자 수 [%d]' %len(self.users))


   def messageHandler(self, username, msg):     # 전송한 msg를 처리하는 부분
      if msg == '/quit':                        # 보낸 메세지가 'quit'이면
         self.removeUser(username)
         return -1
      elif msg == 'ready':                          #client측에서 준비완료된 상태라면.
         self.setUserState(username, 1)
         if self.isReady() == 0:
            self.sendMessageToAll('send')
            self.sendConDataToAll(contractData['1'])
      else:
         self.sendMessageToAll('[%s] %s' %(username, msg))    #input이 'quit'가 아니라면 broadcast
         return

      return

   def setReadyState(self, username, msg):
      if msg == 'ready':
         self.readyState[username] = (1)

      self.sendMessageToAll('ready state : [%d]' %(self.readyState[username]))

   def isReady(self):         #서버에서 계속돌면서 체킹하려고함.
      flag = 0

      for state in self.readyState.values():
             if state == 1:
                 continue
             else:
                 flag = -1
      return flag


   def sendMessageToAll(self, msg): #BroadCast 부분. 추후 변경필요할듯.
      for conn, addr in self.users.values():
             conn.send(msg.encode())

   def sendConDataToAll(self, msg):
      for conn, addr in self.users.values():
             conn.send(json.dumps(msg).encode())       #json 형태의 string을 encode해서 각 client에게 전송.

#   def sendDataToClient(self, msg):
#           self.sendMessageToAll(self, 'John -> Jenny : 15')



class MyTcpHandler(socketserver.BaseRequestHandler):
   userman = UserManager()

   def handle(self):                                    #클라이언트에서 요청이 들어오면 handle이 호출됨.
      print('[%s] 연결됨' %self.client_address[0])       # 클라이언트가 접속시 클라이언트 주소 출력
      try:
          username = self.registerUsername()
          self.userman.setUserState(username, 0)
          while True:
             pre_msg = self.request.recv(16394)     #client에서 전송한 정보를 받음.

             #if type(pre_msg) == bytes:
             msg = pickle.loads(pre_msg)            #json형태의 msg를 역직렬화함.
             while pre_msg:
                 print(msg)
                 if self.userman.messageHandler(username,msg) == -1:    #/quit 입력시 return -1
                     self.request.close()
                     break

                 pre_msg = self.request.recv(1024)   #self.request는 client에 연결된 TCP socket pre_msg에는 추가로 입력되는 input value에 대한 json데이터가 들어올것임.
                 msg = pickle.loads(pre_msg)


         #else:
        #     while pre_msg:
        #         if pre_msg == 'mine'.decode():
        #             print('mining'.encode())
        #             print(pre_msg.decode())
        #             if self.userman.messageHandler(username, pre_msg.decode()) == -1:
        #                 self.request.close()
        #                 break
        #             pre_msg = self.request.recv(1024)

      except Exception as e:
         print(e)

      print('[%s] 접속종료' %self.client_address[0])
      self.userman.removeUser(username)

   def registerUsername(self):
      while True:
         self.request.send(json.dumps('ID :').encode())
         username = self.request.recv(1024) #유저가 ID입력시 receive
         username = username.decode().strip()   #decoding input data
         if self.userman.addUser(username, self.request, self.client_address):  #self.request -> conn
            return username

   def checkRdState(self):
      while True:
         if self.userman.isReady() == 0:
             self.userman.sendMessageToAll('all ready')
         else:
             break
             return -1

class ChatingServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    pass

def runServer():
   print('+++ blockchain network를 시작합니다.')
   print('+++ network를 끝내려면 Ctrl-C를 누르세요.')

   try:
      server = ChatingServer((HOST, PORT), MyTcpHandler)
      server.serve_forever()        #접속요청이 오면 수락한 뒤 BaseRequestHandler 객체의 handle()메소드 호출.
   except KeyboardInterrupt:
      print('--- blockchain network를 종료합니다.')
      server.shutdown()
      server.server_close()

runServer()
