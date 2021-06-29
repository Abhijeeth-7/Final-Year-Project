class CodeAutomation:
    code = \
'''
import autopy
from win32gui import GetForegroundWindow
from win32process import GetWindowThreadProcessId
from win32api import GetSystemMetrics
from psutil import Process
import cv2
import handtrackingmod as htm
import pyautogui
import numpy as np
import mediapipe as mp

class HandDetector():

    def __init__(self, mode=False,maxHands=2,detectionCon=0.9,trackcon=0.7):
        self.mode = mode
        self.maxHands = maxHands
        self.detectioncon = detectionCon
        self.trackcon = trackcon
        self.mpHands = mp.solutions.hands
        self.hands = self.mpHands.Hands(self.mode, self.maxHands, self.detectioncon, self.trackcon)
        self.mpDraw = mp.solutions.drawing_utils


    def findHands(self, img, draw = True):
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.hands.process(imgRGB)

        #draws the connections on the image, only for visual feedback doesnt affect the algorithm

        if self.results.multi_hand_landmarks:
            for handLms in self.results.multi_hand_landmarks:
               if draw:
                   self.mpDraw.draw_landmarks(img, handLms, self.mpHands.HAND_CONNECTIONS)

        return img


    def findPosition(self, img):
        lmList = []
        bbox = [0,0,0,0]
        label = "Right"

        if self.results.multi_hand_landmarks:
            if len(self.results.multi_hand_landmarks)>1:
                handLabel = self.results.multi_handedness[0].classification[0].label
                hand1x = self.results.multi_hand_landmarks[0].landmark[9].x*img.shape[1]
                hand2x = self.results.multi_hand_landmarks[1].landmark[9].x*img.shape[1]
                if abs(hand1x - hand2x) > 50:
                    label="Left"
                    if handLabel == "Right":
                        myHand = self.results.multi_hand_landmarks[0]
                    else:
                        myHand = self.results.multi_hand_landmarks[1]
                else:
                    if handLabel == "Left":
                        myHand = self.results.multi_hand_landmarks[0]
                    else:
                        myHand = self.results.multi_hand_landmarks[1]

            elif len(self.results.multi_hand_landmarks)==1:
                label = "Right"
                myHand = self.results.multi_hand_landmarks[0]

            xmax,ymax = 0,0
            xmin,ymin = 99999,99999
            for id, lm in enumerate(myHand.landmark):
                   h, w, c = img.shape
                   cx, cy = int(lm.x * w), int(lm.y * h)
                   xmin = min(xmin,cx)
                   xmax = max(xmax,cx)
                   ymin = min(ymin,cy)
                   ymax = max(ymax,cy)
                   lmList.append([id, cx, cy, label])
                   cv2.circle(img, (cx, cy), 3, (255, 0, 0), cv2.FILLED)
            bbox = [xmin,ymin,xmax,ymax]

        return lmList,bbox, label

class Comparetor:
    intialPosition = [0, 0]
    finalPosition = [1, 1]
    prevlm = list()
    handDistance = 0

    def __init__(self):
        pass

    def getGestureData(self, hlandmarks, img):
        return [self.getGestureString(hlandmarks), self.identifySwipe(hlandmarks)]

    def identifySwipe(self, hlandmarks):
        try:
            x1, y1 = self.prevlm[9][1], self.prevlm[9][2]
            x2, y2 = hlandmarks[9][1], hlandmarks[9][2]
            if abs(x2 - x1) > 10 and abs(y2 - y1) > 10:
                self.handDistance += ((((x2 - x1) ** 2) + ((y2 - y1) ** 2)) ** 0.5)
            elif abs(x2 - x1) > 10:
                self.handDistance += ((x2 - x1) ** 2) ** 0.5
            elif abs(y2 - y1) > 10:
                self.handDistance += ((y2 - y1) ** 2) ** 0.5
        except:
            pass
        if self.handDistance > 40:
            self.intialPosition = self.finalPosition
            return self.direction(hlandmarks)
        elif self.getGestureString(hlandmarks) == '00000':
            self.handDistance = 0
            self.intialPosition = [hlandmarks[9][1], hlandmarks[9][2]]
            self.finalPosition = [hlandmarks[9][1], hlandmarks[9][2]]
        return False

    def direction(self, hlandmarks):
        dir = 'NONE'
        self.finalPosition = [hlandmarks[9][1], hlandmarks[9][2]]
        x1, y1 = self.intialPosition
        x2, y2 = self.finalPosition
        if abs(x2 - x1) > abs(y2 - y1):
            if (self.intialPosition[0] > self.finalPosition[0]):
                dir = 'Right'
            elif (self.intialPosition[0] < self.finalPosition[0]):
                dir = 'Left'
        else:
            if (self.intialPosition[1] < self.finalPosition[1]):
                dir = 'Down'
            elif (self.intialPosition[1] > self.finalPosition[1]):
                dir = 'Up'
        self.handDistance = 0
        return dir

    def getGestureString(self, hLandmarks):
        fingers = ''
        if hLandmarks[4][3] == "Left":
            if hLandmarks[4][1] < hLandmarks[3][1]:
                fingers += '1'
            else:
                fingers += '0'
        else:
            if hLandmarks[4][1] > hLandmarks[3][1]:
                fingers += '1'
            else:
                fingers += '0'
        if hLandmarks[8][2] < hLandmarks[6][2]:
            fingers += '1'
        else:
            fingers += '0'
        if hLandmarks[12][2] < hLandmarks[10][2]:
            fingers += '1'
        else:
            fingers += '0'
        if hLandmarks[16][2] < hLandmarks[14][2]:
            fingers += '1'
        else:
            fingers += '0'
        if hLandmarks[20][2] < hLandmarks[18][2]:
            fingers += '1'
        else:
            fingers += '0'
        return fingers

class App:

    def __init__(self):
        self.cap = cv2.VideoCapture(0)
        self.wCam, self.hCam = GetSystemMetrics(0), GetSystemMetrics(1)
        self.cap.set(3, self.wCam)
        self.cap.set(4, self.hCam)

        self.frameR = 300
        self.plocX, self.plocY = 0, 0
        self.smoothening = 5
        self.detector = HandDetector()

        self.{actionGestureList}
        self.comparetor = Comparetor()
        self.mode = 0
        self.img = None

    def begin(self):
        while True:
            pid = GetWindowThreadProcessId(GetForegroundWindow())
            try:
                ApplicationName = Process(pid[-1]).name()
            except:
                pass

            sucess, img = self.cap.read()
            img = self.detector.findHands(img)
            self.img = img

            hlandmarks, bbox, label = self.detector.findPosition(img)

            if label == 'Left':
                newMode = self.comparetor.getGestureString(hlandmarks).count('1')
                if newMode != 0:
                    self.mode = newMode

            # generatedCode
            self.matchConfiguredGestures(hlandmarks, ApplicationName, bbox)

            self.comparetor.prevlm = hlandmarks
            cv2.line(img, self.comparetor.intialPosition, self.comparetor.finalPosition, (255, 255, 255), 3)
            cv2.circle(img, self.comparetor.intialPosition, 10, (255, 0, 255), 5)

            cv2.imshow("Image", img)
            cv2.waitKey(1)

    def matchConfiguredGestures(self,hlandmarks, ApplicationName, bbox):
        if len(hlandmarks) == 0:
            return

        gestureString, direction = self.comparetor.getGestureData(hlandmarks,self.img)
        mode = self.mode

        if direction != False:
            swipe = True
        else:
            direction = 'None'
            swipe = False

        cv2.putText(self.img, gestureString, (10, 500), cv2.FONT_HERSHEY_PLAIN, 3, (255, 255, 0), 3)
        cv2.putText(self.img, 'Mode : ' + str(mode), (200, 500), cv2.FONT_HERSHEY_PLAIN, 3, (255, 255, 0), 3)

        if mode == 1:
            if True:
                mx1 = hlandmarks[9][1]
                my1 = hlandmarks[9][2]
                if (gestureString != '00000'):
                    cv2.rectangle(self.img, (self.frameR, self.frameR - 100), (self.wCam - self.frameR - 300, self.hCam - self.frameR + 20),
                                    (255, 0, 255))
                    cv2.rectangle(self.img, (bbox[0] - 20, bbox[1] - 20), (bbox[2] + 20, bbox[3] + 20), (255, 0, 255))
                    mx3 = np.interp(mx1, (self.frameR, self.wCam - self.frameR - 300), (0, self.wCam))
                    my3 = np.interp(my1, (self.frameR - 100, self.hCam - self.frameR + 20), (0, self.hCam))
                    self.clocX = self.plocX + (mx3 - self.plocX) // self.smoothening
                    self.clocY = self.plocY + (my3 - self.plocY) // self.smoothening

                    try:
                        autopy.mouse.move(self.wCam - self.clocX, self.clocY)
                        self.plocX, self.plocY = self.clocX, self.clocY
                    except:
                        pass
                else:
                    try:
                        autopy.mouse.move(self.wCam - self.clocX, self.clocY)
                        self.plocX, self.plocY = self.clocX, self.clocY
                    except:
                        pass

{insertCode}



a = App()
a.begin()
'''

    actionGestureId = 0

    def __init__(self, gestureData,actionData,appData):
        self.gestureData = gestureData
        self.actionData = actionData
        self.appData = appData

    def generateActionGestureList(self):
        count = self.actionGestureId
        result = 'actionGesture = [0]*{count}'.format(count=count)
        return result

    def compareStrings(self,s1,s2):
        s1=''.join(s1.split()).lower()
        s2=''.join(s2.split()).lower()
        return s1==s2

    def generateIFBlock(self,record):
        gestureString = record['gestureString'].split(',')
        action = [r.get('action') for r in self.actionData if self.compareStrings(r.get('actionName'),record.get('actionName'))]
        if len(gestureString) == 1:
            result = \
        '''
                if (gestureString == '{gesture}' and swipe == {swipe} and direction=='{direction}'):
                    pyautogui.{action}
                    return''' \
            .format(action=action[0], gesture=gestureString[0], swipe=record['swipe'],
                    direction=record['direction'])
        else:
            id = self.actionGestureId
            result = \
        '''
                if (gestureString == '{gesture}'):
                    self.actionGesture[{id}] = 1
                    ''' \
            .format(id=id, gesture=gestureString[0])

            result += \
        '''         
                elif self.actionGesture[{id}] and (gestureString == '{gesture}'):
                    pyautogui.{action}
                    self.actionGesture[{id}] = 0
                    return''' \
            .format(id=id, action=action[0], gesture=gestureString[1])
            self.actionGestureId+=1
        return result

    def generateModeBlocks(self,records):
        result = ''
        for mode in range(1,6):
            appBlocks = ''
            filteredRecords = [record for record in records if record["mode"]==mode]
            appBlocks += self.generateApplicationBlocks(filteredRecords)
            if appBlocks=='':
                continue
            else:
                if(mode==1):
                    result+=\
        '''
            {appBlocks}
        '''.format(appBlocks=appBlocks, mode=mode)
                else:
                    result += \
        '''
        if mode == {mode}: 
            {appBlocks}
        '''.format(appBlocks=appBlocks, mode=mode)
        return result

    def generateApplicationBlocks(self, records):
        result = ''
        appNames = set([record['appName'] for record in records])
        for appName in appNames:    
            ifBlocks = ''
            filteredRecords = [record for record in records if record["appName"] == appName]
            for record in filteredRecords:
                ifBlocks += self.generateIFBlock(record)
            if(appName.lower() in ['all applications','mouse']):
                result += \
        '''
            if True:
                {ifBlocks}
        '''\
                .format(ifBlocks=ifBlocks)

            else:
                app = [appRecord['originalName'] for appRecord in self.appData if appRecord['appName']==record['appName']]
                result += \
        '''
            if ApplicationName == '{appName}': 
                {ifBlocks}
        '''\
                .format(ifBlocks=ifBlocks, appName=app[0])
        
        return result

    def genrateScript(self,records):
        generatedCodeString = ''
        generatedCodeString += self.generateModeBlocks(records)
        actionList = self.generateActionGestureList()
        genratedScriptString = self.code.format(actionGestureList=actionList,insertCode=generatedCodeString)
        return genratedScriptString

    def generatePythonCode(self):
        script = self.genrateScript(self.gestureData)
        return script
