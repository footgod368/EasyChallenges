module Level2.Level2Init exposing (init)

{-| Init of Level2 Model.


# init

@docs init

-}

import Array
import Browser.Dom exposing (getViewport)
import GlobalFunction.GlobalBasics as GlobalBasics
import GlobalFunction.GlobalModule as GlobalModule
import Level2.Level2Type as Level2Type
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


{-| `init` of Level2\`Model
-}
init : () -> ( Level2Type.Model, Cmd MainType.Msg )
init a =
    let
        newModel =
            { windowBoundary = ( 1000.0, 800.0 )
            , levelBoundary = ( 90 * 40, 680.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [ Event.hitBlock 1 "first switch" ( 8, 14 ) ( 1, 1 )
                    , Event.hitBlock 2 "first hidden brick" ( 15, 8.5 ) ( 1, 1 )
                    , Event.hitLineSeg 3 "first falling ground" (GlobalBasics.blockPosFloat ( 23, 1 )) (GlobalBasics.blockPosFloat ( 23, 15 ))
                    , Event.hitLineSeg 4 "second falling groud" (GlobalBasics.blockPosFloat ( 38, 12 )) (GlobalBasics.blockPosFloat ( 40, 12 ))
                    , Event.init
                        { id = 5, name = "second falling ground" }
                        (Event.AfterActEvent 4)
                        (Event.TimeAfterStart 60)
                        (Event.quickDuration 10)
                    , Event.hitLineSeg 6 "first transporting board" (GlobalBasics.blockPosFloat ( 42, 9 )) (GlobalBasics.blockPosFloat ( 46, 9 ))
                    , Event.hitBlock 7 "second hidden brick" ( 57.5, 6.5 ) ( 1, 1 )
                    , Event.hitBlock 8 "first hidden needles" ( 57, 5.8 ) ( 3, 0.21 )
                    , Event.hitBlock 9 "first hidden needles" ( 57, 8 ) ( 3, 0.21 )
                    , Event.hitBlock 10 "third hidden brick" ( 71.5, 8.5 ) ( 1, 1 )
                    , Event.hitBlock 11 "third hidden brick" ( 72.5, 8.5 ) ( 1, 1 )
                    , Event.hitLineSeg 12 "enter between tunnels" (GlobalBasics.blockPosFloat ( 72, 14.9 )) (GlobalBasics.blockPosFloat ( 78, 14.9 ))
                    , Event.init
                        { id = 13, name = "falling ground between tunnels" }
                        (Event.AfterActEvent 12)
                        (Event.TimeAfterStart 60)
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 14, name = "hidden bricks between tunnels" }
                        (Event.AfterActEvent 12)
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( GlobalBasics.blockPosFloat ( 72, 13.1 ), GlobalBasics.blockPosFloat ( 78, 13.1 ) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    , Event.hitBlock 15 "Reverse direction" ( 78.125, 11.5 - 1.75 ) ( 1.75, 1.75 )
                    ]
            , boundary = Boundary.normalInit
            , player =
                let
                    defPlayerProperty =
                        Player.defPlayerProperty
                in
                Player.init ( 50.0, 490.0 )
                    Player.defPlayerProperty
                    (Player.ChangeTo { defPlayerProperty | playerHorizontalSpeed = -1.93 } 15 Player.NoNextPropertyChange)
            , bricks =
                Array.fromList
                    (List.concat
                        [ Brick.initRow 15 1 14
                        , [ Brick.init
                                (GlobalBasics.blockPosFloat ( 8, 14 ))
                                (Brick.Detailed 40 40 "#1E90FF")
                                (GlobalModule.Visible (GlobalModule.InvisibleAfterEvent 1 GlobalModule.NoNextVisibility))
                                (GlobalModule.NoCollide GlobalModule.NoNextCollision)
                                GlobalModule.NoNextMove
                          ]
                        , [ Brick.init
                                (GlobalBasics.blockPosFloat ( 8, 14 ))
                                (Brick.Detailed 40 40 "#FFD700")
                                (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 1 GlobalModule.NoNextVisibility))
                                (GlobalModule.NoCollide GlobalModule.NoNextCollision)
                                GlobalModule.NoNextMove
                          ]
                        , let
                            tempBoard1 =
                                NoticeBoard.boundaryCollide ( 7, 5 ) ( 8, 3 )
                          in
                          [ { tempBoard1
                                | move =
                                    GlobalModule.Move
                                        (Array.fromList [])
                                        0.0
                                        1
                                        (GlobalModule.Move
                                            (Array.fromList [ GlobalBasics.blockPosFloat ( 7, 12 ) ])
                                            5.0
                                            -1
                                            GlobalModule.NoNextMove
                                        )
                            }
                          ]
                        , [ Brick.initCollideHidden ( 15, 8.5 ) 2 ]
                        , Brick.initRow 15 22 22
                        , Brick.initFallingRow 15 23 25 3
                        , Brick.initRow 15 26 36
                        , Brick.initFallingRow 12 38 39 5
                        , let
                            tempBoard2 =
                                NoticeBoard.boundaryCollide ( 42, 9 ) ( 4, 1.5 )
                          in
                          [ { tempBoard2
                                | move =
                                    GlobalModule.Move
                                        (Array.fromList [])
                                        0.0
                                        6
                                        (GlobalModule.Move
                                            (Array.fromList [ GlobalBasics.blockPosFloat ( 52.5, 9 ) ])
                                            2.0
                                            -1
                                            GlobalModule.NoNextMove
                                        )
                            }
                          ]
                        , Brick.initRow 15 60 71
                        , Brick.initRow 15 78 90
                        , [ NoticeBoard.boundary ( 57, 6 ) ( 3, 2 ) ]
                        , [ Brick.quickTunnel ( 70, 11.5 )
                          , Brick.quickTunnel ( 78, 11.5 )
                          ]
                        , Brick.initFallingRow 15 72 77 13
                        , Brick.initCollideHiddenRow 12 72 77 14
                        , [ NoticeBoard.boundary ( 72, 6.5 ) ( 6, 3.5 ) ]
                        , [ Brick.initCollideHidden ( 71.5, 8.5 ) 10
                          , Brick.initCollideHidden ( 72.5, 8.5 ) 11
                          ]
                        , [ Brick.init
                                (GlobalBasics.blockPosFloat ( 78.125, 11.5 - 1.75 ))
                                (Brick.Detailed 70 70 "#FFFF00")
                                (GlobalModule.Visible (GlobalModule.InvisibleAfterEvent 15 GlobalModule.NoNextVisibility))
                                (GlobalModule.NoCollide GlobalModule.NoNextCollision)
                                GlobalModule.NoNextMove
                          ]
                        ]
                    )
            , savePoints =
                Array.fromList
                    [ SavePoint.init (GlobalBasics.blockPos ( 2, 14 ))
                    , SavePoint.init (GlobalBasics.blockPos ( 30, 14 ))
                    , SavePoint.init (GlobalBasics.blockPos ( 65, 14 ))
                    ]
            , endPoint = EndPoint.init (GlobalBasics.blockPos ( 89, 14 ))
            , noticeBoards =
                Array.fromList
                    [ let
                        tempBoard1 =
                            NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 10.8, 6.8 )) "It's a trap!" 60
                      in
                      { tempBoard1
                        | move =
                            GlobalModule.Move
                                (Array.fromList [])
                                0.0
                                1
                                (GlobalModule.Move (Array.fromList [ GlobalBasics.blockPosFloat ( 10.8, 13.8 ) ])
                                    5.0
                                    -1
                                    GlobalModule.NoNextMove
                                )
                      }
                    , let
                        tempBoard2 =
                            NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 44, 10 )) "Let's go!" 40
                      in
                      { tempBoard2
                        | move =
                            GlobalModule.Move
                                (Array.fromList [])
                                0.0
                                6
                                (GlobalModule.Move (Array.fromList [ GlobalBasics.blockPosFloat ( 54.5, 10 ) ]) 2.0 -1 GlobalModule.NoNextMove)
                      }
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 58.5, 7.2 )) ":)" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 75, 8 )) "Danger!" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 75, 9.2 )) "↓" 40
                    , let
                        tempBoard3 =
                            NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 79, 11.2 )) "?" 60
                      in
                      { tempBoard3 | noticeBoardVisibility = NoticeBoard.Visible "?" (NoticeBoard.InvisibleAfterEvent 15 NoticeBoard.NoNextNoticeBoardVisibility) }
                    ]
            , needles =
                Array.fromList
                    (List.concat
                        [ Needle.initHiddenFallingRow 8 7 14 1
                        , Needle.initHiddenRow 6 57 59 8
                        , Needle.initHiddenRow 8 57 59 9
                        ]
                    )
            , keyPressed = []
            , gameControl = GameControl.init MainType.Level3
            , mainScene = MainType.Level2
            }
    in
    ( newModel, Task.perform MainType.GetViewport getViewport )
