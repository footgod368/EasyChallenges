module Level4.Level4Init exposing (init)

{-| Init of Level4 Model.


# init

@docs init

-}

import Array
import Browser.Dom exposing (getViewport)
import GlobalFunction.GlobalBasics as GlobalBasics
import GlobalFunction.GlobalModule as GlobalModule
import Level4.Level4Type as Level4Type
import MainFunction.MainType as MainType
import Modules.Boundary as Boundary
import Modules.Brick as Brick
import Modules.EndPoint as EndPoint
import Modules.Event as Event
import Modules.GameControl as GameControl
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player
import Needle
import SavePoint
import Task


{-| `init` of Level4 \`Model
-}
init : () -> ( Level4Type.Model, Cmd MainType.Msg )
init a =
    let
        newModel =
            { windowBoundary = ( 1000.0, 800.0 )
            , levelBoundary = ( 30 * 40, 680.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [ Event.hitBlock 1 "first ?" ( 3.1, 11.6 ) ( 0.8, 1 )
                    , Event.hitBlock 2 "second ?" ( 6.1, 11.6 ) ( 0.8, 1 )
                    , Event.hitBlock 3 "third ?" ( 9.1, 11.6 ) ( 0.8, 1 )
                    , Event.hitBlock 4 "fourth ?" ( 17.1, 11.6 ) ( 0.8, 1 )
                    , Event.hitBlock 5 "fifth ?" ( 20.1, 11.6 ) ( 0.8, 1 )
                    , Event.hitBlock 6 "sixth ?" ( 23.1, 11.6 ) ( 0.8, 1 )
                    , Event.hitBlock 7 "seventh ?" ( 26.1, 11.6 ) ( 0.8, 1 )
                    , Event.hitBlock 8 "eighth ?" ( 23.7, 8.1 ) ( 1, 1 )
                    , let
                        tempEvent1 =
                            Event.hitBlock 9 "get helmet" ( 20, 14 ) ( 1, 1 )
                      in
                      { tempEvent1 | ifStartAct = Event.AfterActEvent 8 }
                    , Event.hitLineSeg 10 "needle" (GlobalBasics.blockPosFloat ( 26.1, 12.6 )) (GlobalBasics.blockPosFloat ( 26.9, 12.6 ))
                    , Event.hitLineSeg 11 "first sword" (GlobalBasics.blockPosFloat ( 12, 1 )) (GlobalBasics.blockPosFloat ( 12, 15 ))
                    , Event.hitBlock 12 "second sword" ( 22.5, 11.5 ) ( 2, 2 )
                    ]
            , boundary = Boundary.normalInit
            , player =
                Player.init ( 50.0, 490.0 ) Player.defPlayerProperty Player.NoNextPropertyChange
            , bricks =
                Array.fromList
                    (List.concat
                        [ Brick.initRow 15 1 10
                        , [ Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 3, 11.5 )) ( 40, 40 ) "#FFFF00"
                          , Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 6, 11.5 )) ( 40, 40 ) "#FFFF00"
                          , Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 9, 11.5 )) ( 40, 40 ) "#FFFF00"
                          , Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 17, 11.5 )) ( 40, 40 ) "#FFFF00"
                          , Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 20, 11.5 )) ( 40, 40 ) "#FFFF00"
                          , Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 23, 11.5 )) ( 40, 40 ) "#FFFF00"
                          , Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 26, 11.5 )) ( 40, 40 ) "#FFFF00"
                          ]
                        , Brick.initRow 15 16 30
                        , [ NoticeBoard.boundary ( 19, 7 ) ( 6, 3 ) ]
                        , [ Brick.init
                                (GlobalBasics.blockPosFloat ( 20, 14 ))
                                (Brick.Detailed 40 40 "#FFFF00")
                                (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 8 (GlobalModule.InvisibleAfterEvent 9 GlobalModule.NoNextVisibility)))
                                (GlobalModule.NoCollide GlobalModule.NoNextCollision)
                                GlobalModule.NoNextMove
                          ]
                        ]
                    )
            , savePoints =
                Array.fromList
                    [ SavePoint.init (GlobalBasics.blockPos ( 2, 14 ))
                    ]
            , endPoint = EndPoint.init (GlobalBasics.blockPos ( 89, 14 ))
            , noticeBoards =
                Array.fromList
                    [ NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 3.5, 12.3 )) "?" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 6.5, 12.3 )) "?" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 9.5, 12.3 )) "?" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 17.5, 12.3 )) "?" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 20.5, 12.3 )) "?" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 23.5, 12.3 )) "?" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 26.5, 12.3 )) "?" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 22, 9 )) "Hit all the \"?\"" 35
                    , NoticeBoard.init
                        (GlobalBasics.blockPosFloat ( 20, 14 ))
                        (NoticeBoard.Invisible (NoticeBoard.VisibleAfterEvent 9 "Your head is full of power!" NoticeBoard.NoNextNoticeBoardVisibility))
                        GlobalModule.NoNextMove
                        30
                    ]
            , needles =
                Array.fromList
                    (List.concat
                        [ [ Needle.init
                                (GlobalBasics.blockPosFloat ( 26.1, 12.5 ))
                                (Needle.NormalNeedle 32 4)
                                (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 10 GlobalModule.NoNextVisibility))
                                (GlobalModule.Collide (GlobalModule.NoCollideAfterEvent 9 GlobalModule.NoNextCollision))
                                GlobalModule.NoNextMove
                          ]
                        , [ Needle.sword ( 12, 15 ) ( 12, -10 ) ( 3, 5 ) 7.0 11 ]
                        , [ Needle.sword ( 28, 12 ) ( -10, 12 ) ( 4, 2 ) 7.0 12 ]
                        ]
                    )
            , keyPressed = []
            , gameControl = GameControl.init MainType.Level4
            , mainScene = MainType.Level4
            , number = []
            }
    in
    ( newModel, Task.perform MainType.GetViewport getViewport )
