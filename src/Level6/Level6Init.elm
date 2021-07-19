module Level6.Level6Init exposing (init)

{-| Init of Level6 Model.


# init

@docs init

-}

import Array
import Browser.Dom exposing (getViewport)
import GlobalFunction.GlobalBasics as GlobalBasics
import GlobalFunction.GlobalModule as GlobalModule
import Level6.Level6Type as Level6Type
import MainFunction.MainType as MainType
import Modules.Boundary as Boundary
import Modules.Brick as Brick
import Modules.EndPoint as EndPoint
import Modules.Event as Event
import Modules.GameControl as GameControl
import Modules.Needle as Needle
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player
import Modules.SavePoint as SavePoint
import Task


{-| `init` of Level6 \`Model
-}
init : () -> ( Level6Type.Model, Cmd MainType.Msg )
init a =
    let
        newModel =
            { windowBoundary = ( 1000.0, 800.0 )
            , levelBoundary = ( 85 * 40, 680.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [ 
                        Event.hitBlock 1 "A" (5.5,12) (2,2) 
                    ,   Event.hitBlock 2 "B" (11.5, 10) (1,1)
                    ,   Event.hitBlock 3 "C" (8.5, 4) (1, 10)
                    ,   Event.hitBlock 31 "D" (9.5, 4) (1, 10)
                    ,   Event.hitBlock 4 "ship1" (21, 10) (3,2)
                    ,   Event.init {id=5, name= "ship2"}
                            (Event.AfterActEvent 4)
                            (Event.TimeAfterStart 200)
                            (Event.quickDuration 10)
                    ,   Event.init {id=6, name= "ship3"}
                            (Event.AfterActEvent 5)
                            (Event.TimeAfterStart 100)
                            (Event.quickDuration 10)
                    ,   Event.hitBlock 7 "needle" (26.2, 6) (0.6,4.8)
                    ,   Event.hitBlock 9 "finaltrap" (36, 6) (1, 7)
                    ,   Event.init
                             {id=10, name= "Falling"}
                             (Event.AfterActEvent 9)
                             (Event.PlayerCollide 
                                     (GlobalBasics.Polygon (Array.fromList [
                                             (GlobalBasics.blockPosFloat (28,12), GlobalBasics.blockPosFloat (34.5,12))
                                         ])))
                             (Event.quickDuration 10)
                    ,   Event.init {id=11, name= "a1"}
                            (Event.AfterActEvent 9)
                            (Event.TimeAfterStart 180)
                            (Event.quickDuration 10)
                    ,   Event.init {id=12, name= "a2"}
                            (Event.AfterActEvent 11)
                            (Event.TimeAfterStart 1)
                            (Event.quickDuration 10)
                    ,   Event.init {id=13, name= "a3"}
                            (Event.AfterActEvent 12)
                            (Event.TimeAfterStart 30)
                            (Event.quickDuration 10)
                    ,   Event.init {id=14, name= "ship2"}
                            (Event.AfterActEvent 4)
                            (Event.TimeAfterStart 120)
                            (Event.quickDuration 10)
                    ,   Event.init {id=15, name= "b1"}
                            (Event.AfterActEvent 13)
                            (Event.TimeAfterStart 150)
                            (Event.quickDuration 10)
                    ,   Event.init {id=16, name= "b2"}
                            (Event.AfterActEvent 15)
                            (Event.TimeAfterStart 50)
                            (Event.quickDuration 10)
                    ,   Event.init {id=17, name= "b3"}
                            (Event.AfterActEvent 16)
                            (Event.TimeAfterStart 1)
                            (Event.quickDuration 10)
                    ,   Event.init {id=18, name= "b4"}
                            (Event.AfterActEvent 17)
                            (Event.TimeAfterStart 150)
                            (Event.quickDuration 10)
                    ,   Event.init {id=19, name= "c1"}
                            (Event.AfterActEvent 18)
                            (Event.TimeAfterStart 100)
                            (Event.quickDuration 10)
                    ,   Event.init {id=20, name= "c2"}
                            (Event.AfterActEvent 19)
                            (Event.TimeAfterStart 1)
                            (Event.quickDuration 10)
                    ,   Event.init {id=21, name= "c3"}
                            (Event.AfterActEvent 20)
                            (Event.TimeAfterStart 30)
                            (Event.quickDuration 10)
                    ,   Event.init {id=22, name= "hint1"}
                            (Event.AfterActEvent 9)
                            (Event.TimeAfterStart 100)
                            (Event.quickDuration 10)
                    ,   Event.init {id=23, name= "hint1"}
                            (Event.AfterActEvent 9)
                            (Event.TimeAfterStart 130)
                            (Event.quickDuration 10)
                    ,   Event.init {id=24, name= "hint2"}
                            (Event.AfterActEvent 13)
                            (Event.TimeAfterStart 70)
                            (Event.quickDuration 10)
                    ,   Event.init {id=25, name= "hint2"}
                            (Event.AfterActEvent 13)
                            (Event.TimeAfterStart 100)
                            (Event.quickDuration 10)
                    ,   Event.init {id=26, name= "hint3"}
                            (Event.AfterActEvent 18)
                            (Event.TimeAfterStart 20)
                            (Event.quickDuration 10)
                    ,   Event.init {id=27, name= "hint3"}
                            (Event.AfterActEvent 18)
                            (Event.TimeAfterStart 50)
                            (Event.quickDuration 10)
                    ,   Event.init {id=30, name= "finish"}
                            (Event.AfterActEvent 21)
                            (Event.TimeAfterStart 50)
                            (Event.quickDuration 10)
                    ,   Event.init {id=32, name= "ship4"}
                            (Event.AfterActEvent 6)
                            (Event.TimeAfterStart 110)
                            (Event.quickDuration 10)
                    ,   Event.init {id=33, name= "ship5"}
                            (Event.AfterActEvent 32)
                            (Event.TimeAfterStart 2)
                            (Event.quickDuration 10)
                    ,   let
                            temp = Event.hitLineSeg 34 "g" (GlobalBasics.blockPosFloat (26,11)) (GlobalBasics.blockPosFloat (27,11))
                        in
                        { temp | duration = Event.quickDuration 9999 }
                    ,   Event.hitBlock 35 "hidden" (28,9) (2,2)
                    ,   Event.hitBlock 36 "sword" (28.2,11) (1,1)
                    ,   Event.hitBlock 51 "magicbox" (50, 9.9) (1, 1.2)
                    ,   Event.hitBlock 52 "hidden" (55, 10) (2, 1)
                    ,   Event.hitBlock 53 "sword" (57, 5) (2, 5)
                    ]
            , boundary = Boundary.normalInit
            , player = Player.init (  50.0, 440.0  ) Player.defPlayerProperty Player.NoNextPropertyChange
            , bricks =
                Array.fromList
                    (List.concat
                        [ 
                            [Brick.initPosVolumeColor (GlobalBasics.blockPosFloat (1,13)) (120, 120) "#3834ED"]
                        ,   [Brick.initPosVolumeColor (GlobalBasics.blockPosFloat (5.5,6)) (80, 80) "#00000050"] 
                        ,   let 
                                tempBrick1 = Brick.initFallingBrick (GlobalBasics.blockPosFloat (5.5,12)) 1
                            in
                            [ { tempBrick1 | appearance = Brick.Detailed 80 80 "#3834ED", 
                                             collisionBox = Brick.brickCollisionBox (Brick.Detailed 80 80 "#3834ED")}]
                        ,   [Brick.initPosVolumeColor (GlobalBasics.blockPosFloat (8.5,11)) (160, 80) "#3834ED"]
                        ,   [Brick.initPosVolumeColor (GlobalBasics.blockPosFloat (8.5,4)) (160, 80) "#3834ED"]
                        ,   Brick.initRow 12 15 18
                        ,   let 
                                ship = Brick.initPosVolumeColor (GlobalBasics.blockPosFloat(21,10)) (120,80) "#EE82EE"
                            in
                            [{ ship| move = GlobalModule.Move (Array.fromList[]) 0 5 
                                                 (GlobalModule.Move (Array.fromList[GlobalBasics.blockPosFloat (21,12)]) 3 6
                                                 (GlobalModule.Move (Array.fromList[GlobalBasics.blockPosFloat (25,12)]) 1.5 -1 GlobalModule.NoNextMove))
                              }]
                        ,   Brick.initFallingRow 12 28 34 10
                        ,   Brick.initRow 12 35 39
                        ,   [Brick.initPosVolumeColor (GlobalBasics.blockPosFloat (40 , 10)) ( 120, 320) "#00cdcd"]
                        ,   let
                                base2 = Brick.initPosVolumeColor (GlobalBasics.blockPosFloat(40.1,9.8)) (32,8) "#700000"
                            in
                            [{ base2| visibility = GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 9 (GlobalModule.InvisibleAfterEvent 30 (GlobalModule.NoNextVisibility)))
                             , collision = GlobalModule.NoCollide GlobalModule.NoNextCollision
                            }]
                        ,   let
                                base1 = Brick.initPosVolumeColor (GlobalBasics.blockPosFloat(39.8,11.1)) (8,32) "#700000"
                            in
                            [{ base1| visibility = GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 9 (GlobalModule.InvisibleAfterEvent 30 (GlobalModule.NoNextVisibility)))
                             , collision = GlobalModule.NoCollide GlobalModule.NoNextCollision
                             , move = GlobalModule.Move (Array.fromList[]) 0.0 15
                                     (GlobalModule.Move (Array.fromList[GlobalBasics.blockPosFloat(39.8,11.1), GlobalBasics.blockPosFloat(39.8,10.1)]) 1.5 19 
                                     (GlobalModule.Move (Array.fromList[GlobalBasics.blockPosFloat(39.8,10.1), GlobalBasics.blockPosFloat(39.8,11.1)]) 1.5 -1 GlobalModule.NoNextMove))
                            }]
                        ,   Brick.initRow 10 25 27
                        ,   let
                                base0 = Brick.initPosVolumeColor (GlobalBasics.blockPosFloat(26.1,9.8)) (32,8) "#700000"
                            in

                        ,   let
                                hidden = Brick.initCollideHidden (28, 9) 35
                            in
                            [{ hidden | appearance = Brick.Detailed 80 80 "#00000050", 
                                        collisionBox = Brick.brickCollisionBox (Brick.Detailed 80 80 "#00000050")}]
                        ,   [Brick.initPosVolumeColor (GlobalBasics.blockPosFloat (48 , 13)) ( 320, 200) "#cd00cd"]
                        ,   [Brick.initPos (GlobalBasics.blockPosFloat (50 , 10))]
                        ,   [Brick.initPosVolumeColor (GlobalBasics.blockPosFloat(52.1, 4.8)) (32,8) "#700000"]
                        ,   [Brick.initPosVolumeColor (GlobalBasics.blockPosFloat (60 , 13)) ( 600, 200) "#cd00cd"]
                        ,   Brick.initCollideHiddenRow 10 55 56 52
                        ,   [Brick.initPos (GlobalBasics.blockPosFloat (65 , 10))]
                        ]
                    )
            , savePoints =
                Array.fromList
                    [ SavePoint.init (GlobalBasics.blockPos ( 2, 12 ))
                    , SavePoint.init (GlobalBasics.blockPos ( 41, 9 ))
                    ]
            , endPoint = EndPoint.init (GlobalBasics.blockPosFloat (80,13))
            , noticeBoards =
                Array.fromList
                    [   NoticeBoard.init (GlobalBasics.blockPosFloat (38.8,11.5))
                            (NoticeBoard.Invisible (NoticeBoard.VisibleAfterEvent 22 "!"
                            (NoticeBoard.InvisibleAfterEvent 23 NoticeBoard.NoNextNoticeBoardVisibility)))
                        GlobalModule.NoNextMove
                        60
                        ,
                        NoticeBoard.init (GlobalBasics.blockPosFloat (38.8,11.5))
                            (NoticeBoard.Invisible (NoticeBoard.VisibleAfterEvent 24 "!"
                            (NoticeBoard.InvisibleAfterEvent 25 NoticeBoard.NoNextNoticeBoardVisibility)))
                        GlobalModule.NoNextMove
                        60
                        ,
                        NoticeBoard.init (GlobalBasics.blockPosFloat (38.8,11.5))
                            (NoticeBoard.Invisible (NoticeBoard.VisibleAfterEvent 26 "!"
                            (NoticeBoard.InvisibleAfterEvent 27 NoticeBoard.NoNextNoticeBoardVisibility)))
                        GlobalModule.NoNextMove
                        60
                        ,
                        NoticeBoard.init (GlobalBasics.blockPosFloat (22.5,11))
                            (NoticeBoard.Invisible (NoticeBoard.VisibleAfterEvent 4 "Follow me ^_^"
                            (NoticeBoard.InvisibleAfterEvent 14 NoticeBoard.NoNextNoticeBoardVisibility)))
                        GlobalModule.NoNextMove
                        16
                        ,
                        NoticeBoard.init (GlobalBasics.blockPosFloat (26.5,13))
                            (NoticeBoard.Invisible (NoticeBoard.VisibleAfterEvent 32 "Jump"
                            (NoticeBoard.InvisibleAfterEvent 33 NoticeBoard.NoNextNoticeBoardVisibility)))
                        GlobalModule.NoNextMove
                        16
                        ,   NoticeBoard.quickInit (GlobalBasics.blockPosFloat (6.5,7.4)) "↓" 40
                        ,   NoticeBoard.quickInit (GlobalBasics.blockPosFloat (26.5,10.85)) "?" 40
                        ,   NoticeBoard.quickInit (GlobalBasics.blockPosFloat (50.5,10.85)) "?" 40
                        ,   NoticeBoard.quickInit (GlobalBasics.blockPosFloat (65.5,10.85)) "?" 40
                    ]
            , needles =
                Array.fromList
                    (List.concat
                        [   let
                                needle0 = Needle.initFalling ( 9, 6 ) 3
                            in
                            [{ needle0| move = GlobalModule.Move (Array.fromList [])
                                        0.0
                                        3
                                        (GlobalModule.Move (Array.fromList [ GlobalBasics.blockPosFloat ( 8.5, 20 ) ]) 1.8 -1 GlobalModule.NoNextMove) 
                                        , pos = GlobalBasics.blockPosFloat ( 8.5, 6 )}]
                        ,   let
                                needle1 = Needle.initFalling ( 9, 6 ) 31
                            in
                            [{ needle1| move = GlobalModule.Move (Array.fromList [])
                                        0.0
                                        31
                                        (GlobalModule.Move (Array.fromList [ GlobalBasics.blockPosFloat ( 9.5, 20 ) ]) 1.8 -1 GlobalModule.NoNextMove) 
                                        , pos = GlobalBasics.blockPosFloat ( 9.5, 6 )}]
                        ,   [Needle.initPos ( 181, 280 ), Needle.initPos( 221, 280 )]
                        ,   let
                                tempNeedle1 = Needle.initPos (GlobalBasics.blockPosFloat ( 10.5, 10.9 ))
                            in
                            [{ tempNeedle1 | move = GlobalModule.Move (Array.fromList [])
                                0.0
                                2
                                (GlobalModule.Move (Array.fromList [ (GlobalBasics.blockPosFloat ( 10.5, 10.9 )), (GlobalBasics.blockPosFloat ( 11.5, 10.9 )) ]) 2.0 -1 GlobalModule.NoNextMove)}]
                        ,   [Needle.init (GlobalBasics.blockPosFloat ( 22, 11.35 )) (Needle.NormalNeedle 711 12)
                                (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 11 (GlobalModule.InvisibleAfterEvent 13 GlobalModule.NoNextVisibility)))
                                (GlobalModule.NoCollide (GlobalModule.CollideAfterEvent 12 (GlobalModule.NoCollideAfterEvent 13 GlobalModule.NoNextCollision)))
                                (GlobalModule.NoNextMove)]
                        ,   [Needle.init (GlobalBasics.blockPosFloat ( 40, 1 )) (Needle.NormalNeedle 40 351)
                                (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 9 (GlobalModule.InvisibleAfterEvent 30 GlobalModule.NoNextVisibility)))
                                (GlobalModule.NoCollide (GlobalModule.CollideAfterEvent 9 (GlobalModule.NoCollideAfterEvent 30 GlobalModule.NoNextCollision)))
                                (GlobalModule.NoNextMove)]
                        ,   [Needle.init (GlobalBasics.blockPosFloat ( 22, 10.35 )) (Needle.NormalNeedle 711 12)
                                (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 16 (GlobalModule.InvisibleAfterEvent 18 GlobalModule.NoNextVisibility)))
                                (GlobalModule.NoCollide (GlobalModule.CollideAfterEvent 17 (GlobalModule.NoCollideAfterEvent 18 GlobalModule.NoNextCollision)))
                                (GlobalModule.NoNextMove)]
                        ,   [Needle.init (GlobalBasics.blockPosFloat ( 22, 10.35 )) (Needle.NormalNeedle 711 12)
                                (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 19 (GlobalModule.InvisibleAfterEvent 21 GlobalModule.NoNextVisibility)))
                                (GlobalModule.NoCollide (GlobalModule.CollideAfterEvent 20 (GlobalModule.NoCollideAfterEvent 21 GlobalModule.NoNextCollision)))
                                (GlobalModule.Move (Array.fromList[]) 0.0 19 
                                 (GlobalModule.Move (Array.fromList[GlobalBasics.blockPosFloat(22,10.35), GlobalBasics.blockPosFloat(22,11.35)]) 1.5 -1 GlobalModule.NoNextMove ))]
                        ,   [Needle.init (GlobalBasics.blockPosFloat ( 26.35, 1 )) (Needle.NormalNeedle 12 351)
                                (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 7 (GlobalModule.InvisibleAfterEvent 34 GlobalModule.NoNextVisibility)))
                                (GlobalModule.NoCollide (GlobalModule.CollideAfterEvent 7 (GlobalModule.NoCollideAfterEvent 34 GlobalModule.NoNextCollision)))
                                (GlobalModule.NoNextMove)]
                        ,   [Needle.sword (55,10.5) (19,10.5) (4,2) 20 36]
                        ,   [Needle.initHidden (50, 11) 51]
                        ,   [Needle.initHidden (50, 10) 51]
                        ,   [Needle.sword (57,20) (57,-4) (2,3) 10 53]
                        ]
                    )
            , keyPressed = []
            , gameControl = GameControl.init MainType.Level6
            , mainScene = MainType.Level6
            }
    in
    ( newModel, Task.perform MainType.GetViewport getViewport )
