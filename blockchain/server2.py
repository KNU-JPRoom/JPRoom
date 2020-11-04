import socketserver
import threading
import pickle
import sys
import json
from time import time
import datetime
import hashlib

from json import loads

HOST = '127.0.0.1'
PORT = 7777
#q = queue.Queue()                #연속적으로 들어올 condata를 저정하기위한 큐
#contractData = {}

#contractData['1'] = '{"transaction": "sena->russian", "amount": 30}'

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
      MSG = {'ID': False, 'Block': False, 'context': username + ' was in network'}
      self.sendMessageToAll(MSG)
      print('+++ 노드 참여자 수 [%d]' %len(self.users))
      return username

#   def setUserState(self, username, state):
#       lock.acquire()
##       lock.release()

#       print('set state about [%s]' %username)
#       return

   def removeUser(self, username):
       if username not in self.users:
          return

       lock.acquire()
       del self.users[username]
       lock.release()
       MSG = {'ID': False, 'Block': False, 'context': username + 'was out network'}
       self.sendMessageToAll(MSG)
       print('--- 노드 참여자 수 [%d]' %len(self.users))


   def messageHandler(self, username, msg):
       if msg == '/quit':                        # 보낸 메세지가 'quit'이면
          self.removeUser(username)
          return -1
       else:
          self.sendMessageToAll('[%s] %s' %(username, msg))    #input이 'quit'가 아니라면 broadcast
          return


   def sendMessageToAll(self, msg): #BroadCast 부분. 추후 변경필요할듯.
       for conn, addr in self.users.values():
          conn.send(pickle.dumps(msg))

   def sendConDataToAll(self, msg):
       for conn, addr in self.users.values():
          conn.send(pickle.dumps(msg))       #json 형태의 string을 encode해서 각 client에게 전송.

   def sendDataToClient(self, msg):
       self.sendMessageToAll(self, 'John -> Jenny : 15')



class MyTcpHandler(socketserver.BaseRequestHandler):
    LIMIT_QUNTITY = 2
    difficulty = 2
    userman = UserManager()
    conBuff = ["jax send 50$ to piora", "yasuo send 30$ to shen", "ramus send 10$ to anivia"]
    blockindex = 0
    previous_hash = 0
    blockChain = [
        {
            'hash':'',
            'updatable':True,
            'data':
            {
                'index':blockindex,
                'timestamp': time(),
                'transaction': 'start',
                'proof': 0,
                'difficulty': difficulty,
                'previous_hash': previous_hash
             }
        }
    ]
#    print(blockChain)
    blockDstring = json.dumps(blockChain[0]['data'], sort_keys=True).encode()
    blockChain[0]['hash'] = hashlib.sha256(blockDstring).hexdigest()
    previous_hash = blockChain[0]['hash']
#    print(blockChain)
    MSG = {'ID': False, 'Block': False, 'completable': False,
           'data':{'index': blockindex, 'timestamp' : 0, 'transaction': conBuff, 'proof': 0, 'difficulty' : difficulty,  'previous_hash': previous_hash}}
    block1 = {
                'hash': hashlib.sha256(json.dumps(conBuff[0]).encode()).hexdigest(),
                'updatable':True,
                'data':
                {
                    'index':blockindex + 1,
                    'timestamp': time(),
                    'transaction': conBuff[0],
                    'proof': 0,
                    'difficulty': difficulty,
                    'previous_hash': blockChain[0]['hash']
                }
             }
    blockChain.append(block1)
    block2 = {
                'hash': hashlib.sha256(json.dumps(conBuff[1]).encode()).hexdigest(),
                'updatable':True,
                'data':
                {
                    'index':blockindex + 2,
                    'timestamp': time(),
                    'transaction': conBuff[1],
                    'proof': 0,
                    'difficulty': difficulty,
                    'previous_hash': blockChain[1]['hash']
                }
             }
    blockChain.append(block2)

    def handle(self):                                    #클라이언트에서 요청이 들어오면 handle이 호출됨.
      print('[%s] 연결됨' %self.client_address[0])       # 클라이언트가 접속시 클라이언트 주소 출력
      try:
          username = self.registerUsername()
          print(username)
#          self.userman.setUserState(username, 0)
          dic = {i:obj for i, obj in enumerate(self.blockChain[::-1])}        #가장 최근(가장 끝의) 블록에 번호를 매겨 역순으로 딕셔너라에 저장 후 노드에게 전송.
          print(dic)
#          self.userman.users[username][0].send(pickle.dumps(self.MSG))
          self.userman.users[username][0].send(pickle.dumps(dic))

          while True:
             pre_msg = self.request.recv(16394)     #client에서 전송한 정보를 받음.
             msg = pre_msg.decode()
             if msg[:9] == "WEBSERVER":
                 conBuff.append(msg[9:])
                 if len(self.conBuff) >= self.LIMIT_QUNTITY and self.blockChain[(self.blockindex)-1][updatable]== True:
                     self.MSG['data']['transaction']=self.conBuff[:self.LIMIT_QUNTITY]
                     self.conBuff = self.conBuff[self.LIMIT_QUNTITY:]
                     timestamp = datetime.datetime.now().strftime("%I:%M:%S %p")
                     self.MSG['data']['timestamp'] = timestamp
                     self.blockChain.append({
                              'updatable':False,
                              'data':
                              {
                                'index':self.blockindex,
                                'timestamp': timestamp,
                                'transaction': self.MSG['transaction'],
                                'proof': 0,
                                'difficulty': self.difficulty,
                                'previous_hash': self.previous_hash
                               }
                            })
                     sendConDataToAll(self.MSG)
                     self.blockindex = (self.blockindex) + 1
             else:
                 blockData = json.loads(pre_msg.decode())          #client에서 전송한 block의 data
                 cpDic = blockChain.copy()
                 cpDic[blockData['index']]['proof'] = blockData['proof']
                 guess = (cpDic.encode())
                 guess_hash = hashlib.sha256(guess).hexdigest()     #node에서 전송한 블록이 유효한지 검사.

                 if guess_hash[:difficulty]== "0"*difficulty:       #유효하다면
                     self.blockChain[blockData['index']]['hash']=guess_hash
                     self.blockChain[blockData['index']]['updatable']=True
                     self.previous_hash = guess_hash
                     cpDic['data']['previous_hash']=self.blockChain[blockData['index']-1]
                     MSG = {'completable': True,'data':cpDic['data'] }

                     sendConDataToAll(MSG)
                 else:
                     MSG = {'completable': False,'data':self.blockChain[blockData['index']]['data'] }
                     self.userman.users[username][0].send(MSG.encode())

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
      MSG = {'ID': True, 'Block': False, 'context': 'ID: '}
      while True:
         self.request.send(pickle.dumps(MSG))
         username = self.request.recv(1024) #유저가 ID입력시 receive
#         print(username)
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

    @staticmethod
    def valid_proof(cpDic):
      guess = (cpDic.encode())
      guess_hash = hashlib.sha256(guess).hexdigest()
      return guess_hash[:3] == "000" # nonce

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
